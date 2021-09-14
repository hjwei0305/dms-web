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
        <FormItem label="数字属性" hidden>
          {getFieldDecorator('uiConfig.extra', {
            initialValue: get(defaultValues, 'uiConfig.extra'),
          })(<Input disabled />)}
        </FormItem>
      </>
    );
  }
}

export default PropsForm;
