import React, { PureComponent } from 'react';
import { ExtModal } from 'suid';
import FormPanel from '../FormPanel';

class FormModal extends PureComponent {
  render() {
    const { visible, onCancel, createType } = this.props;
    const title = '新建';

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        maskClosable={false}
        title={title}
        onOk={() => {
          this.formRef.onFormSubmit();
        }}
      >
        <FormPanel onRef={inst => (this.formRef = inst)} isCreate createType={createType} />
      </ExtModal>
    );
  }
}

export default FormModal;
