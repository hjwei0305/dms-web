import React, { Component } from 'react';
import { Drawer, Form, Button } from 'antd';
import { ScrollBar, ProLayout } from 'suid';
import Space from '@/components/Space';

import ExtFormRender from '@/components/ExtFormRender';

const { Content, Footer } = ProLayout;

@Form.create({})
class FilterDrawer extends Component {
  state = {
    formKey: Math.random(),
  };

  onFormSubmit = () => {
    const { onFilter } = this.props;
    if (this.valids && !this.valids.length && onFilter) {
      onFilter({ ...this.formValues });
    }
  };

  handleFormValueChange = values => {
    this.formValues = values;
  };

  handleValidate = valids => {
    this.valids = valids;
  };

  handleReset = () => {
    this.setState(
      {
        formKey: Math.random(),
      },
      () => {
        this.formValues = {};
        this.onFormSubmit();
      },
    );
  };

  render() {
    const { formKey } = this.state;
    const { visible, onCancel, uiConfig } = this.props;
    return (
      <Drawer
        visible={visible}
        title="过滤条件"
        placement="right"
        bodyStyle={{
          height: 'calc(100% - 55px)',
          padding: 0,
        }}
        onClose={onCancel}
      >
        <ProLayout>
          <Content style={{ padding: 16 }}>
            <ScrollBar>
              <ExtFormRender
                key={formKey}
                onValidate={this.handleValidate}
                onChange={this.handleFormValueChange}
                uiConfig={uiConfig}
                formData={{}}
              />
            </ScrollBar>
          </Content>
          <Footer align="end">
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
