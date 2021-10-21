import React, { useRef } from 'react';
import { Drawer, Button } from 'antd';
import { ScrollBar, ProLayout } from 'suid';
import { omit, merge } from 'lodash';
import Form from '@/components/ExtForm';
import Space from '@/components/Space';

const { Content, Footer } = ProLayout;
const defaultFormProps = {
  layout: 'vertical',
};

const DrawerForm = props => {
  const { onOk, onClose, renderFormItems, formProps, title, confirmLoading, children } = props;

  const form = useRef(null);
  const onFormSubmit = () => {
    form.current.validateFields((err, formData) => {
      if (!err && onOk) {
        onOk(formData);
      }
    });
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const finalFormProps = merge(defaultFormProps, formProps || {});
  const drawerProps = merge(
    {
      bodyStyle: {
        height: title ? 'calc(100% - 56px)' : '100%',
        padding: 0,
      },
      placement: 'right',
    },
    omit(props, ['renderFormItems', 'form', 'formProps', 'onOk', 'confirmLoading', 'drawerKey']),
  );

  return (
    <Drawer {...drawerProps} destroyOnClose>
      <ProLayout>
        <Content>
          <ScrollBar>
            <Form
              style={{ padding: 16 }}
              {...finalFormProps}
              onRef={inst => {
                form.current = inst;
              }}
            >
              {renderFormItems}
            </Form>
          </ScrollBar>
        </Content>
        <Footer align="end">
          <Space>
            <Button onClick={handleClose}>取消</Button>
            <Button loading={confirmLoading} onClick={onFormSubmit} type="primary">
              确定
            </Button>
          </Space>
        </Footer>
      </ProLayout>
      {children}
    </Drawer>
  );
};

export default DrawerForm;
