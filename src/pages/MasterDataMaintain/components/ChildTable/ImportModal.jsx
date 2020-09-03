import React, { PureComponent } from 'react';
import { ExtModal, utils } from 'suid';
import { Button, Upload, Icon, message } from 'antd';
import { get } from 'lodash';

const { dataExport } = utils;
const { exportJsonToXlsx } = dataExport;

class ExportModal extends PureComponent {
  handleDownload = () => {
    const { editData } = this.props;
    const { name, typeName } = editData;
    const { importUiConfig = {} } = JSON.parse(get(editData, 'impExpData', JSON.stringify({})));
    const { colItems } = importUiConfig;
    const columns = colItems.map(item => {
      const [{ code: dataIndex }, { title }] = item;

      return {
        title,
        dataIndex,
      };
    });

    exportJsonToXlsx({
      columns,
      data: [],
      fileName: `${typeName}-${name}主数据导入模版`,
      sheetName: '模版',
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
  };

  getUploadProps = () => {
    return {
      name: 'file',
      accept: '.xls,.xlsx',
      // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      showUploadList: false,
      // headers: {
      //   authorization: 'authorization-text',
      // },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
  };

  render() {
    const { editData, onCancel } = this.props;

    return (
      <ExtModal title={`${editData.name}批量导入`} visible onCancel={onCancel}>
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
