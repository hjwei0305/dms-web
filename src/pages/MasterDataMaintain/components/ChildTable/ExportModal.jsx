import React, { PureComponent } from 'react';
import { ExtModal, ScrollBar } from 'suid';
import ExtFormRender from '@/components/ExtFormRender';

class ExportModal extends PureComponent {
  onFormSubmit = () => {
    const { onSave } = this.props;
    if (this.valids && !this.valids.length && onSave) {
      onSave(this.formValues);
    }
  };

  handleFormValueChange = values => {
    this.formValues = values;
  };

  handleValidate = valids => {
    this.valids = valids;
  };

  render() {
    const { saving, onCancel, filterFormData, uiConfig } = this.props;

    const title = '批量导出';

    return (
      <ExtModal
        visible
        destroyOnClose
        // centered
        onCancel={onCancel}
        confirmLoading={saving}
        title={title}
        onOk={() => {
          this.onFormSubmit();
        }}
        width={550}
        okText="导出"
      >
        <div>
          <ScrollBar>
            <ExtFormRender
              onValidate={this.handleValidate}
              onChange={this.handleFormValueChange}
              uiConfig={uiConfig}
              formData={filterFormData}
            />
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default ExportModal;
