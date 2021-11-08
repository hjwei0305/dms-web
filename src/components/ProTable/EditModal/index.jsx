import React, { useState } from 'react';
import { Button } from 'antd';
import { isPlainObject, get } from 'lodash';
import PopoverIcon from '@/components/PopoverIcon';
import ModalForm from '@/components/ModalForm';

const EditModal = props => {
  const [visible, setVisible] = useState(false);
  const { currData, add, modalForm, onOk, confirmLoading } = props;
  const {
    width,
    formProps = {
      layout: 'vertical',
      labelCol: null,
      wrapperCol: null,
    },
    render: renderFormItems,
  } = modalForm || {};

  if (!isPlainObject(modalForm)) {
    return null;
  }

  const modalProps = {
    formKey: currData,
    title: currData ? '编辑' : '新建',
    visible,
    width,
    formProps,
    onOk: vals => {
      if (onOk) {
        onOk(vals, currData).then(() => {
          setVisible(false);
        });
      } else {
        setVisible(false);
      }
    },
    onCancel: () => {
      setVisible(false);
    },
    confirmLoading,
    renderFormItems: (form, FormItem) =>
      renderFormItems && renderFormItems(form, FormItem, currData),
  };

  return (
    <>
      {currData ? (
        <PopoverIcon
          type="edit"
          tooltip={{
            title: '编辑',
          }}
          onClick={() => {
            setVisible(true);
          }}
          antd
        />
      ) : (
        <Button
          onClick={() => {
            setVisible(true);
          }}
          type="primary"
        >
          {get(add, 'title', '新建')}
        </Button>
      )}
      <ModalForm {...modalProps} />
    </>
  );
};

export default EditModal;
