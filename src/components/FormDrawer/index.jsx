import React, { Component } from 'react';
import { Drawer, Form, Button } from 'antd';
import { ScrollBar, ProLayout } from 'suid';
import Space from '@/components/Space';

const { Content, Footer } = ProLayout;
const { Item: FormItem } = Form;

@Form.create({})
class FilterDrawer extends Component {
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
    const { title, placement = 'right', visible, onClose, renderFormItems, form } = this.props;
    return (
      <Drawer
        visible={visible}
        title={title}
        placement={placement}
        bodyStyle={{
          height: 'calc(100% - 55px)',
          padding: 0,
        }}
        onClose={onClose}
      >
        <ProLayout>
          <Content style={{ padding: 16 }}>
            <ScrollBar>
              <Form>{renderFormItems && renderFormItems(form, FormItem)}</Form>
            </ScrollBar>
          </Content>
          <Footer style={{ justifyContent: 'flex-end' }}>
            <Space>
              <Button onClick={this.handleReset}>重置</Button>
              <Button onClick={this.onFormSubmit} type="primary">
                过滤
              </Button>
            </Space>
          </Footer>
        </ProLayout>
      </Drawer>
    );
  }
}

export default FilterDrawer;
