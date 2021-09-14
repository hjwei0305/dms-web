import React, { forwardRef, useImperativeHandle } from 'react';
import { omit, get, isEmpty } from 'lodash';
import { MoneyInput } from 'suid';

const ExtMoneyInput = (props, ref) => {
  const { dependenciedFields = [], form, preFields = [], onChange, disabled } = props;

  const inputProps = omit(props, [
    'dependenciedFields',
    'form',
    'preFields',
    'onChange',
    'disabled',
  ]);

  let tempDisabled = false;

  if (form) {
    // 根据前置表单值计算当前组件的禁用状态
    const formValues = form.getFieldsValue();

    tempDisabled = preFields.reduce((pre, curr) => {
      const currValue = get(formValues, curr);
      if (currValue === undefined || currValue === null || currValue === '') {
        return true;
      }
      return pre;
    }, disabled);
  }

  const handleChange = e => {
    window.setTimeout(() => {
      // 当前组件变化时，清空被依赖的表单值
      const resetValues = dependenciedFields.reduce((pre, curr) => {
        Object.assign(pre, {
          [curr]: undefined,
        });
        return pre;
      }, {});
      if (!isEmpty(resetValues)) {
        form.setFieldsValue(resetValues);
      }
    }, 0);
    if (onChange) {
      onChange(e);
    }
  };

  useImperativeHandle(ref, () => ({
    // TODO:
  }));

  return <MoneyInput {...inputProps} disabled={tempDisabled} onChange={handleChange} />;
};

export default forwardRef(ExtMoneyInput);
