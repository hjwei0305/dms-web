import React, { useRef } from 'react';
import { omit, merge } from 'lodash';
import { ExtModal } from 'suid';
import Form from '@/components/ExtForm';

const defaultFormProps = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
  layout: 'horizontal',
};

const ModalForm = props => {
  const form = useRef(null);
  const { onOk, renderFormItems, formProps, formKey } = props;

  const handleSave = () => {
    form.current.validateFields((err, formData) => {
      if (!err && onOk) {
        onOk(formData);
      }
    });
  };

  const extModalProps = omit(props, ['formProps', 'renderFormItems', 'form', 'onOk', 'formKey']);

  const fullFormCfg = merge(defaultFormProps, formProps || {});

  return (
    <ExtModal {...extModalProps} onOk={handleSave} destroyOnClose>
      <Form key={formKey} {...fullFormCfg} onRef={inst => (form.current = inst)}>
        {renderFormItems}
      </Form>
    </ExtModal>
  );
};

export default ModalForm;
