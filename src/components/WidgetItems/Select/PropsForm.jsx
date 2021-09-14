import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { get } from 'lodash';

const FormItem = Form.Item;

class PropsForm extends Component {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  render() {
    const { form, defaultValues } = this.props;
    const { getFieldDecorator } = form;
    return (
      <>
        <FormItem label="数据源">
          {getFieldDecorator('options', {
            initialValue: get(defaultValues, 'options'),
          })(<Input />)}
        </FormItem>
      </>
    );
  }
}

export default PropsForm;
