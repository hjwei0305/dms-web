import React, { PureComponent } from 'react';
import { ExtModal, ScrollBar } from 'suid';
import ExtFormRender from '@/components/ExtFormRender';

class FormModal extends PureComponent {
  onFormSubmit = () => {
    const { onSave, rowData } = this.props;
    if (this.valids && !this.valids.length && onSave) {
      onSave({ ...rowData, ...this.formValues });
    }
  };

  handleFormValueChange = values => {
    this.formValues = values;
  };

  handleValidate = valids => {
    this.valids = valids;
  };

  render() {
    const { saving, visible, onCancel, rowData, formUiConfig } = this.props;

    const title = rowData ? '编辑' : '新建';

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        confirmLoading={saving}
        title={title}
        onOk={() => {
          this.onFormSubmit();
        }}
        width={550}
        okText="保存"
      >
        <div>
          <ScrollBar>
            <ExtFormRender
              onValidate={this.handleValidate}
              onChange={this.handleFormValueChange}
              uiConfig={
                rowData
                  ? {
                      ...formUiConfig,
                      ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[2]]) },
                    }
                  : {
                      ...formUiConfig,
                      ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[1]]) },
                    }
              }
              formData={rowData}
            />
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
