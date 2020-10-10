import React, { Component } from 'react';
import { Drawer, Form, Button } from 'antd';
import { ScrollBar } from 'suid';

import ExtFormRender from '@/components/ExtFormRender';

@Form.create({})
class FilterDrawer extends Component {
  state = {
    formKey: Math.random(),
  };

  onFormSubmit = () => {
    const { onFilter } = this.props;
    if (this.valids && !this.valids.length && onFilter) {
      console.log('FilterDrawer -> onFormSubmit -> formValues', this.formValues);
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
    this.setState({
      formKey: Math.random(),
    });
  };

  render() {
    const { formKey } = this.state;
    const { visible, onCancel, uiConfig } = this.props;
    return (
      <Drawer
        visible={visible}
        title="过滤条件"
        placement="right"
        onOk={this.onFormSubmit}
        bodyStyle={{
          height: 'calc(100% - 56px)',
          paddingBottom: 53,
        }}
        onClose={onCancel}
        maskClosable={false}
      >
        <ScrollBar>
          <ExtFormRender
            key={formKey}
            onValidate={this.handleValidate}
            onChange={this.handleFormValueChange}
            uiConfig={uiConfig}
            formData={{}}
          />
        </ScrollBar>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={this.handleReset} style={{ marginRight: 8 }}>
            重置
          </Button>
          <Button onClick={this.onFormSubmit} type="primary">
            过滤
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default FilterDrawer;
