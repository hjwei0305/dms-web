import React, { forwardRef, useImperativeHandle } from 'react';
import { omit, get, isEmpty } from 'lodash';
import { Select } from 'antd';

const ExtSelect = (props, ref) => {
  const { dependenciedFields = [], form, preFields = [], onChange, disabled, options } = props;

  let dataSource = [];
  try {
    dataSource = JSON.parse(options);
  } catch (error) {
    throw new Error(error);
  }

  const selectProps = omit(props, [
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

  return (
    <Select {...selectProps} disabled={tempDisabled} onChange={handleChange}>
      {dataSource.map(({ label, value }) => (
        <Select.Option key={value} value={value}>
          {label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default forwardRef(ExtSelect);
