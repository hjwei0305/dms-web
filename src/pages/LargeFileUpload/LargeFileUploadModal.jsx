import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import LargeFileUpload from './LargeFileUpload';

class LargeFileUploadModal extends PureComponent {
  render() {
    const { visible, onCancel, afterUpload } = this.props;
    return (
      <Modal
        title="大文件上传"
        visible={visible}
        onCancel={onCancel}
        footer={null}
        afterUpload={afterUpload}
      >
        <LargeFileUpload />
      </Modal>
    );
  }
}

export default LargeFileUploadModal;
