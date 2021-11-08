import React, { forwardRef, useImperativeHandle } from 'react';
import { ComboGrid } from 'suid';
import { omit, isEmpty, get } from 'lodash';

const TableSelect = (props, ref) => {
  const {
    dependenciedFields = [],
    form,
    preFields = [],
    submitFields = [],
    originFields = [],
    afterSelect,
    disabled,
  } = props;

  const comboGridProps = omit(props, [
    'dependenciedFields',
    'originFields',
    'submitFields',
    'preFields',
    'afterSelect',
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

  const handleSelect = e => {
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
    if (afterSelect) {
      afterSelect(e);
    }
  };

  useImperativeHandle(ref, () => ({
    // TODO:
  }));

  return (
    <ComboGrid
      {...comboGridProps}
      disabled={tempDisabled}
      afterSelect={handleSelect}
      reader={{
        name: props.showField,
        field: originFields,
      }}
      field={submitFields}
    />
  );
};

export default forwardRef(TableSelect);
