import React, { forwardRef, useImperativeHandle } from 'react';
import { omit, get, isEmpty } from 'lodash';
import { Switch } from 'antd';

const ExtSwitch = (props, ref) => {
  const { dependenciedFields = [], form, preFields = [], onChange, disabled } = props;

  const switchProps = omit(props, [
    'dependenciedFields',
    'form',
    'preFields',
    'onChange',
    'disabled',
    'submitFields',
    'originFields',
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

  return <Switch {...switchProps} disabled={tempDisabled} onChange={handleChange} />;
};

export default forwardRef(ExtSwitch);
