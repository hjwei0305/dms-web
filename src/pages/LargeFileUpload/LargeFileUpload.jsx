import React, { Component } from 'react';
import { Upload, Button, Icon, Progress, List, Divider, Popconfirm, message } from 'antd';
import { utils } from 'suid';

import workerStr from './worker.js';

const SIZE = 50 * 1024 * 1024; // 切片大小

const { request } = utils;

class LargeFileUpload extends Component {
  state = {
    fileList: [],
    uploading: false,
    percent: 0,
    uploadSpeed: '0 B/s',
    hasUploadFileList: [],
    processFile: false,
    mergeFile: false,
  };

  loadedPercent = [];

  progress = [];

  startUploadTime = 0;

  startUploadSize = 0;

  createFileChunks = (file, chunkSize = SIZE) => {
    const fileChunkList = [];
    let cur = 0;
    let chunkNumber = 1;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + chunkSize), chunkNumber });
      cur += chunkSize;
      chunkNumber += 1;
    }

    return fileChunkList;
  };

  // formatUploadTime = s => {
  //   let m = Math.floor(s/60);;
  // }

  calculateUploadSpeed = () => {
    let totalLoaded = 0;
    // let totalSize = 0;
    const tempTime = new Date().getTime();
    const perTime = (tempTime - this.startUploadTime) / 1000;
    this.startUploadTime = new Date().getTime();
    this.progress.forEach(item => {
      const { loaded = 0 } = item || {};
      totalLoaded += loaded;
      // totalSize += total;
    });
    const perLoaded = totalLoaded - this.startUploadSize;
    this.startUploadSize = totalLoaded;
    let uploadSpeed = perLoaded / perTime;
    // let bspeed = uploadSpeed;
    let units = 'b/s';
    if (uploadSpeed / 1024 > 1) {
      uploadSpeed /= 1024;
      units = 'k/s';
    }
    if (uploadSpeed / 1024 > 1) {
      uploadSpeed /= 1024;
      units = 'M/s';
    }
    uploadSpeed = uploadSpeed.toFixed(1);
    // let resttime = ((evt.total-evt.loaded)/bspeed).toFixed(1);
    // resttime = s_to_hs(resttime);
    return `${uploadSpeed} ${units}`;
  };

  handleProgress = (progressEvent, index, chunkNumber) => {
    const complete = Math.floor((progressEvent.loaded / progressEvent.total).toFixed(2) * 100);
    this.loadedPercent[index] = complete;
    this.progress[index] = { total: progressEvent.total, loaded: progressEvent.loaded };
    let percent = 0;
    this.loadedPercent.forEach(item => {
      percent += item;
    });
    percent = Math.floor(percent / chunkNumber);

    this.setState({
      percent,
      uploadSpeed: this.calculateUploadSpeed(),
    });
  };

  checkChunk = params => {
    return request({
      url: '/api-gateway/edm-service/file/checkChunk',
      method: 'GET',
      params,
    });
  };

  mergeFile = params => {
    return request({
      method: 'POST',
      url: '/api-gateway/edm-service/file/mergeFile',
      params,
    });
  };

  uploadChunks = (fileChunks, originFile, hash, totalChunks) => {
    const requestList = fileChunks
      .map(({ file, chunkNumber }) => {
        const formData = new FormData();
        formData.append('file', file, originFile.name);
        formData.append('fileMd5', hash);
        formData.append('currentChunkSize', file.size);
        formData.append('chunkNumber', chunkNumber);
        formData.append('chunkSize', SIZE);
        formData.append('totalChunks', totalChunks || fileChunks.length);
        formData.append('totalSize', originFile.size);
        return {
          formData,
        };
      })
      .map(({ formData }, index) => {
        return request({
          url: `/api-gateway/edm-service/file/uploadChunk?random=${index}`,
          // url: `http://localhost:3000/upload?random=${index}`,
          method: 'POST',
          data: formData,
          onUploadProgress: progressEvent =>
            this.handleProgress(progressEvent, index, fileChunks.length),
        });
      });
    return Promise.all(requestList);
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const { afterUpload } = this.props;
    const [file] = fileList;
    this.setState({
      processFile: true,
    });

    this.calculateHash([{ file }]).then(({ hash }) => {
      this.checkChunk({
        fileMd5: hash,
      })
        .then(result => {
          const { success: sucs, data: checkData, message: mesg } = result || {};
          const { chunks = [], docId, chunkSize, uploadState, totalChunks } = checkData || {};
          if (sucs && uploadState !== 'completed') {
            const chunkFileList = this.createFileChunks(file, chunkSize || SIZE).filter(
              item => !(chunks || []).some(it => it.chunkNumber === item.chunkNumber),
            );
            this.setState({
              processFile: false,
              uploading: true,
            });
            this.startUploadTime = new Date().getTime();
            this.startUploadSize = 0;
            this.uploadChunks(chunkFileList, file, hash, totalChunks)
              .then(() => {
                this.setState({
                  uploading: false,
                  mergeFile: true,
                });
                return this.mergeFile({
                  fileMd5: hash,
                  fileName: file.name,
                });
              })
              .then(res => {
                const { success, message: msg, data } = res || {};
                if (success) {
                  this.setState(
                    ({ hasUploadFileList }) => ({
                      hasUploadFileList: [
                        { id: data.docId, name: file.name, size: file.size },
                      ].concat(hasUploadFileList),
                      fileList: [],
                    }),
                    () => {
                      if (afterUpload) {
                        afterUpload({
                          id: data.docId,
                          name: file.name,
                          size: file.size,
                        });
                      }
                    },
                  );
                } else {
                  message.error(msg || '合并文件时出错了');
                }
              })
              .finally(() => {
                this.setState({
                  mergeFile: false,
                  percent: 0,
                  uploadSpeed: '0 B/s',
                });
              });
          }
          if (sucs && uploadState === 'completed' && docId) {
            this.setState(
              ({ hasUploadFileList }) => ({
                hasUploadFileList: [
                  {
                    id: docId,
                    name: file.name,
                    size: file.size,
                  },
                ].concat(hasUploadFileList),
                fileList: [],
                processFile: false,
              }),
              () => {
                if (afterUpload) {
                  afterUpload({
                    id: docId,
                    name: file.name,
                    size: file.size,
                  });
                }
              },
            );
          }
          if (!sucs) {
            message.error(mesg);
            this.setState({
              processFile: false,
            });
          }
        })
        .catch(err => {
          message.error(err.message);
          this.setState({
            processFile: false,
          });
        });
    });
  };

  calculateHash = fileChunkList => {
    return new Promise(resolve => {
      const hashWorker = new Worker(URL.createObjectURL(new Blob([workerStr])));
      hashWorker.postMessage({ fileChunkList });
      hashWorker.onmessage = e => {
        const { hash } = e.data;
        resolve({ hash });
      };
    });
  };

  formatFileSize = fileSize => {
    let temp = 0;
    if (fileSize < 1024) {
      return `${fileSize}B`;
    }

    if (fileSize < 1024 * 1024) {
      temp = fileSize / 1024;
      temp = temp.toFixed(2);
      return `${temp}KB`;
    }

    if (fileSize < 1024 * 1024 * 1024) {
      temp = fileSize / (1024 * 1024);
      temp = temp.toFixed(2);
      return `${temp}MB`;
    }

    temp = fileSize / (1024 * 1024 * 1024);
    temp = temp.toFixed(2);
    return `${temp}GB`;
  };

  getSubTitle = file => {
    return this.formatFileSize(file.size);
  };

  handleRemoveFile = item => {
    this.setState(({ hasUploadFileList }) => ({
      hasUploadFileList: hasUploadFileList.filter(it => it.id !== item.id),
    }));
  };

  getUploadBtnTitle = () => {
    const { uploading, processFile, mergeFile } = this.state;
    if (mergeFile) {
      return '正在合并';
    }
    if (processFile) {
      return '对大文件分片';
    }
    if (uploading) {
      return '正在上传';
    }
    return '开始上传';
  };

  render() {
    const {
      uploading,
      fileList,
      percent,
      uploadSpeed,
      processFile,
      mergeFile,
      hasUploadFileList,
    } = this.state;
    const props = {
      showUploadList: false,
      onRemove: () => {
        this.loadedPercent = [];
        this.setState({
          fileList: [],
          percent: 0,
          uploadSpeed: '0 B/s',
        });
      },
      beforeUpload: file => {
        this.loadedPercent = [];
        this.setState({
          fileList: [file],
          percent: 0,
          uploadSpeed: '0 B/s',
        });
        return false;
      },
    };

    return (
      <div>
        <div>
          <Upload {...props}>
            <Button disabled={processFile}>
              <Icon type="upload" /> 选择文件
            </Button>
          </Upload>
          <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
            loading={uploading || processFile || mergeFile}
            style={{ float: 'right' }}
          >
            {this.getUploadBtnTitle()}
          </Button>
          <Divider dashed />
        </div>
        <List
          dataSource={fileList.concat(hasUploadFileList)}
          renderItem={item => (
            <List.Item
              actions={
                item.id
                  ? [
                      <Popconfirm
                        title={`是否删除附件【${item.name}】`}
                        okText="是"
                        cancelText="否"
                        onConfirm={() => this.handleRemoveFile(item)}
                      >
                        <Icon key="remove" type="delete" />
                      </Popconfirm>,
                    ]
                  : []
              }
            >
              <List.Item.Meta title={item.name} description={this.getSubTitle(item)} />
              {item.id ? (
                <Progress type="circle" width={40} percent={100} />
              ) : (
                <div style={{ width: 150 }}>
                  <Progress percent={percent} status={percent !== 100 ? 'active' : 'success'} />
                  {percent !== 100 ? uploadSpeed : null}
                </div>
              )}
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default LargeFileUpload;
