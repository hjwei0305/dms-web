import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { Input, Icon } from 'antd';
import { ComboList } from 'suid';
import { get, isFunction } from 'lodash';

const InputSelect = (props, ref) => {
  const { onChange, value, fillValue, listProps } = props;
  // searchPlaceHolder: '请输入代码或名称搜索',
  // name: 'name',
  // store: {
  //   type: 'GET',
  //   autoLoad: false,
  //   url: `${BASICCONTEXT}/corporation/getUserAuthorizedEntities`,
  // },
  // rowKey: 'id',
  // reader: {
  //   name: 'name',
  //   description: 'code',
  // },
  // afterSelect: it => {
  //   const val = get(it, name, '');
  //   setInputValue(val);
  //   onChange(val);
  // },
  const comboListProps = !!listProps && {
    ...listProps,
    afterSelect: it => {
      const val = isFunction(fillValue) ? fillValue(it) : get(it, fillValue, '');
      setInputValue(val);
      onChange(val);
      if (listProps.afterSelect) {
        listProps.afterSelect(it);
      }
    },
  };
  const [inputValue, setInputValue] = useState(value);
  const comboListRef = useRef(null);

  const handleChange = e => {
    if (onChange) {
      onChange(e.target.value);
      setInputValue(e.target.value);
    }
  };

  const toggleOpen = () => {
    if (comboListRef.current) {
      comboListRef.current.showComboList(true);
    }
  };

  useImperativeHandle(ref, () => ({}));

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Input
        value={inputValue}
        style={{ width: '100%' }}
        addonAfter={!!comboListProps && <Icon onClick={toggleOpen} type="select" />}
        onChange={handleChange}
      />
      {!!comboListProps && (
        <ComboList
          {...comboListProps}
          ref={comboListRef}
          style={{
            display: 'block',
            width: '100%',
            height: 0,
            padding: 0,
            margin: 0,
            overflow: 'hidden',
            visibility: 'hidden',
          }}
        />
      )}
    </div>
  );
};

export default forwardRef(InputSelect);
