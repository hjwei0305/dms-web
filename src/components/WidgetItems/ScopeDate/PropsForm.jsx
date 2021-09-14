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
        <FormItem label="提交属性" hidden>
          {getFieldDecorator('uiConfig.submitFields[0]', {
            initialValue: get(defaultValues, ['uiConfig', 'submitFields', 0], 'StartDate'),
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="提交属性" hidden>
          {getFieldDecorator('uiConfig.submitFields[1]', {
            initialValue: get(defaultValues, ['uiConfig', 'submitFields', 1], 'EndDate'),
          })(<Input disabled />)}
        </FormItem>
      </>
    );
  }
}

export default PropsForm;
