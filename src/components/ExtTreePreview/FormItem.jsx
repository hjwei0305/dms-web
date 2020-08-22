import React, { PureComponent } from 'react';
import { ScrollBar } from 'suid';
import ExtFormRender from '@/components/ExtFormRender';

class FormItems extends PureComponent {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  onFormSubmit = () => {
    const { onSave, editData, parentData } = this.props;
    if (this.valids && !this.valids.length && onSave) {
      const params = { ...editData, ...this.formValues };
      if (parentData) {
        Object.assign(params, { parentId: parentData.id });
      }
      onSave(params);
    }
  };

  handleFormValueChange = values => {
    this.formValues = values;
  };

  handleValidate = valids => {
    this.valids = valids;
  };

  render() {
    const { editData, formUiConfig } = this.props;

    return (
      <ScrollBar>
        <ExtFormRender
          onValidate={this.handleValidate}
          onChange={this.handleFormValueChange}
          uiConfig={formUiConfig}
          formData={editData}
        />
      </ScrollBar>
    );
  }
}

export default FormItems;
