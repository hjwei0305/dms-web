import React from 'react';
import { Popconfirm } from 'antd';
import { isPlainObject } from 'lodash';
import PopoverIcon from '@/components/PopoverIcon';

const DeleteIcon = props => {
  const { delId, delData, onDelete, del } = props;

  if (!isPlainObject(del)) {
    return null;
  }

  return (
    <Popconfirm
      key="delete"
      placement="topLeft"
      title="删除后不可恢复，确定要删除吗？"
      onCancel={e => e.stopPropagation()}
      onConfirm={e => {
        if (onDelete) {
          onDelete(delData);
        }
        e.stopPropagation();
      }}
    >
      {delId === delData.id ? (
        <PopoverIcon className="del" type="loading" antd />
      ) : (
        <PopoverIcon
          onClick={e => e.stopPropagation()}
          tooltip={{ title: '删除' }}
          className="del"
          type="delete"
          antd
        />
      )}
    </Popconfirm>
  );
};

export default DeleteIcon;
