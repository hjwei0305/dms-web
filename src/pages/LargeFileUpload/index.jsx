import React, { Component } from 'react';
import { Button } from 'antd';
import LargeFileUploadModal from './LargeFileUploadModal';

class UploadBtn extends Component {
  state = {
    visible: false,
  };

  handleClick = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleLargeFileUpload = file => {
    console.log({
      id: file.id,
      name: file.name,
      uid: file.id,
      response: [file],
      status: 'done',
    });
  };

  render() {
    const { visible } = this.state;
    return (
      <div>
        <Button onClick={this.handleClick}>大文件上传</Button>
        <LargeFileUploadModal
          afterUpload={this.handleLargeFileUpload}
          visible={visible}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default UploadBtn;
