import React, { PureComponent } from 'react';
import { ExtModal, utils } from 'suid';
import { Button, Upload, Icon } from 'antd';
// import { get } from 'lodash';

const { dataExport } = utils;
const { exportJsonToXlsx } = dataExport;

class ExportModal extends PureComponent {
  state = {
    fileList: [],
    // uploading: false,
  };

  handleDownload = () => {
    const { editData, getExportData } = this.props;
    const { name, categoryName } = editData;
    // const importUiConfig = JSON.parse(get(uiConfig, 'Import', JSON.stringify({})));
    // const { colItems } = importUiConfig;

    if (getExportData) {
      getExportData().then(result => {
        const { data, success } = result || {};
        if (success) {
          const { title: titles, example } = data;
          const columns = example.map((title, index) => {
            return {
              title,
              dataIndex: titles[index],
            };
          });
          exportJsonToXlsx({
            columns,
            data: [],
            fileName: `${categoryName}-${name}主数据导入模版`,
            sheetName: '模版',
            firstRowHidden: false,
            beforeExport: () => {
              console.log('ExportModal -> handleDownload -> beforeExport');
              // this.setState({
              //   loading: true,
              // });
              return true;
            },
            afterExport: () => {
              console.log('ExportModal -> handleDownload -> afterExport');
              // this.setState({
              //   loading: false,
              // });
            },
          });
        }
      });
    }
  };

  handleUpload = () => {
    const { onUpload } = this.props;
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
      onUpload(formData);
    });
  };

  getUploadProps = () => {
    return {
      name: 'file',
      accept: '.xls,.xlsx',
      // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      showUploadList: true,
      // headers: {
      //   authorization: 'authorization-text',
      // },
      // onChange(info) {
      //   if (info.file.status !== 'uploading') {
      //     console.log(info.file, info.fileList);
      //   }
      //   if (info.file.status === 'done') {
      //     message.success(`${info.file.name} file uploaded successfully`);
      //   } else if (info.file.status === 'error') {
      //     message.error(`${info.file.name} file upload failed.`);
      //   }
      // },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
    };
  };

  render() {
    const { editData, onCancel } = this.props;

    return (
      <ExtModal
        title={`${editData.name}批量导入`}
        visible
        onCancel={onCancel}
        onOk={this.handleUpload}
      >
        1、下载{`${editData.name}主数据`}导入模版进行填写，
        <Button style={{ padding: 0 }} type="link" onClick={this.handleDownload}>
          下载模版
        </Button>
        <br />
        2、
        <Upload {...this.getUploadProps()}>
          <Button>
            <Icon type="upload" /> 选择文件
          </Button>
        </Upload>
      </ExtModal>
    );
  }
}

export default ExportModal;
