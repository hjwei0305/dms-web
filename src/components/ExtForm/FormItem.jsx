import React from 'react';
import { Form } from 'antd';
import { useGlobal } from './hooks';

const { Item } = Form;

const FormItem = props => {
  const [{ form }] = useGlobal();
  const { getFieldDecorator } = form || {};
  const { children, name, initialValue, valuePropName = 'value', rules, ...rest } = props;
  if (!form) {
    return null;
  }

  return (
    <Item {...rest}>
      {getFieldDecorator(name, {
        valuePropName,
        initialValue,
        rules,
      })(children)}
    </Item>
  );
};

export default FormItem;
