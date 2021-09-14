import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { omit, merge } from 'lodash';
import { ExtModal } from 'suid';

const FormItem = Form.Item;
const defaultFormProps = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
  layout: 'horizontal',
};

@Form.create()
class ModalForm extends PureComponent {
  handleSave = () => {
    const { form, onOk } = this.props;
    form.validateFields((err, formData) => {
      if (!err && onOk) {
        onOk(formData);
      }
    });
  };

  render() {
    const { form, renderFormItems, formProps, formKey } = this.props;
    const extModalProps = omit(this.props, [
      'formProps',
      'renderFormItems',
      'form',
      'onOk',
      'formKey',
    ]);

    const fullFormCfg = merge(defaultFormProps, formProps || {});

    return (
      <ExtModal {...extModalProps} onOk={this.handleSave} destroyOnClose>
        <Form key={formKey} {...fullFormCfg}>
          {renderFormItems && renderFormItems(form, FormItem)}
        </Form>
      </ExtModal>
    );
  }
}

export default ModalForm;
