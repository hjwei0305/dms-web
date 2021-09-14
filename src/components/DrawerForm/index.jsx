import React, { Component } from 'react';
import { Drawer, Form, Button } from 'antd';
import { ScrollBar, ProLayout } from 'suid';
import { omit, merge } from 'lodash';
import Space from '@/components/Space';

const { Content, Footer } = ProLayout;
const { Item: FormItem } = Form;
const defaultFormProps = {
  layout: 'vertical',
};

@Form.create({})
class DrawerForm extends Component {
  onFormSubmit = () => {
    const { form, onOk } = this.props;
    form.validateFields((err, formData) => {
      if (!err && onOk) {
        onOk(formData);
      }
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.reset();
  };

  handleClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  render() {
    const {
      renderFormItems,
      form,
      formProps,
      title,
      confirmLoading,
      children,
      drawerKey,
    } = this.props;
    console.log('DrawerForm -> render -> this.props', this.props);
    const finalFormProps = merge(defaultFormProps, formProps || {});
    const drawerProps = merge(
      {
        bodyStyle: {
          height: title ? 'calc(100% - 56px)' : '100%',
          padding: 0,
        },
        placement: 'right',
      },
      omit(this.props, [
        'renderFormItems',
        'form',
        'formProps',
        'onOk',
        'confirmLoading',
        'drawerKey',
      ]),
    );

    return (
      <Drawer {...drawerProps} key={drawerKey} destroyOnClose>
        <ProLayout>
          <Content>
            <ScrollBar>
              <Form style={{ padding: 16 }} {...finalFormProps}>
                {renderFormItems && renderFormItems(form, FormItem)}
              </Form>
            </ScrollBar>
          </Content>
          <Footer align="end">
            <Space>
              <Button onClick={this.handleClose}>取消</Button>
              <Button loading={confirmLoading} onClick={this.onFormSubmit} type="primary">
                确定
              </Button>
            </Space>
          </Footer>
        </ProLayout>
        {children}
      </Drawer>
    );
  }
}

export default DrawerForm;
