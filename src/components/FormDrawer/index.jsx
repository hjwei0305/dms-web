import React, { Component } from 'react';
import { Drawer, Form, Button } from 'antd';
import { ScrollBar, ProLayout } from 'suid';
import { omit, merge } from 'lodash';
import Space from '@/components/Space';

const { Content, Footer } = ProLayout;
const { Item: FormItem } = Form;
const defaultFormProps = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
  layout: 'horizontal',
};

@Form.create({})
class FormDrawer extends Component {
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

  render() {
    const { renderFormItems, form, formProps, confirmLoading, onClose } = this.props;
    const finalFormProps = merge(defaultFormProps, formProps || {});
    const drawerProps = merge(
      {
        bodyStyle: {
          height: 'calc(100% - 55px)',
          padding: 0,
        },
        placement: 'right',
      },
      omit(this.props, ['renderFormItems', 'form', 'formProps', 'confirmLoading']),
    );

    return (
      <Drawer {...drawerProps} destroyOnClose>
        <ProLayout>
          <Content style={{ padding: 0 }}>
            <ScrollBar>
              <Form {...finalFormProps} style={{ padding: 12 }}>
                {renderFormItems && renderFormItems(form, FormItem)}
              </Form>
            </ScrollBar>
          </Content>
          <Footer align="end">
            <Space>
              <Button onClick={onClose}>取消</Button>
              <Button loading={confirmLoading} onClick={this.onFormSubmit} type="primary">
                确定
              </Button>
            </Space>
          </Footer>
        </ProLayout>
      </Drawer>
    );
  }
}

export default FormDrawer;
