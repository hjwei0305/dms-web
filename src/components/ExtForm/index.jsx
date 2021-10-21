import React, { useEffect } from 'react';
import { Form } from 'antd';
import { isFunction } from 'lodash';
import { Ctx } from './context';
import { useSet } from './hooks';
import Item from './FormItem';

const ExtForm = props => {
  const { form, children, onRef, ...rest } = props;
  const globalState = useSet({
    form,
  });

  useEffect(() => {
    if (onRef) {
      onRef(form);
    }
  }, [form]);

  return (
    <Ctx.Provider value={globalState}>
      <Form {...rest}>{isFunction(children) ? children(form, Item) : children}</Form>
    </Ctx.Provider>
  );
};

ExtForm.Item = Item;

export default Form.create({
  onValuesChange: ({ onValuesChange }, _, allValues) => {
    if (onValuesChange) {
      onValuesChange(allValues, _);
    }
  },
})(ExtForm);
