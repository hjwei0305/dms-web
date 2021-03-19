import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { omit, merge } from 'lodash';
import { ExtModal } from 'suid';

const FormItem = Form.Item;
const defaultFormCfg = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
  layout: 'horizontal',
};

@Form.create()
class FormModal extends PureComponent {
  handleSave = () => {
    const { form, onOk } = this.props;
    form.validateFields((err, formData) => {
      if (!err && onOk) {
        onOk(formData);
      }
    });
  };

  render() {
    const { form, renderFormItems, formCfg } = this.props;
    const extModalProps = omit(this.props, ['formCfg', 'renderFormItems', 'form', 'onOk']);

    const fullFormCfg = merge(defaultFormCfg, formCfg || {});

    return (
      <ExtModal {...extModalProps} onOk={this.handleSave}>
        <Form {...fullFormCfg}>{renderFormItems && renderFormItems(form, FormItem)}</Form>
      </ExtModal>
    );
  }
}

export default FormModal;
