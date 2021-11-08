import React, { useState } from 'react';
import { isPlainObject, get } from 'lodash';
import { Button } from 'antd';
import PopoverIcon from '@/components/PopoverIcon';
import DrawerForm from '@/components/DrawerForm';

const EditDrawer = props => {
  const [visible, setVisible] = useState(false);
  const { drawerForm, add, currData, onOk, confirmLoading } = props;
  const {
    width: drawerWidth,
    drawerProps = {
      layout: 'vertical',
    },
    render: renderDrawerFormItems,
  } = drawerForm || {};

  if (!isPlainObject(drawerForm)) {
    return null;
  }

  const drawerFormProps = {
    drawerKey: currData,
    title: currData ? '编辑' : '新建',
    visible,
    width: drawerWidth,
    ...drawerProps,
    onOk: vals => {
      if (onOk) {
        onOk(vals, currData).then(() => {
          setVisible(false);
        });
      } else {
        setVisible(false);
      }
    },
    onClose: () => setVisible(false),
    confirmLoading,
    renderFormItems: (form, FormItem) =>
      renderDrawerFormItems && renderDrawerFormItems(form, FormItem, currData),
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
      <DrawerForm {...drawerFormProps} />
    </>
  );
};

export default EditDrawer;
