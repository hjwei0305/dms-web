import React, { Component } from 'react';
import { Input } from 'antd';
import { get } from 'lodash';
import Form from '@/components/ExtForm';

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
        <FormItem
          label="提交属性"
          hidden
          name="uiConfig.submitFields[0]"
          initialValue={get(defaultValues, ['uiConfig', 'submitFields', 0], 'StartDate')}
        >
          <Input disabled />
        </FormItem>
        <FormItem
          label="提交属性"
          name="uiConfig.submitFields[1]"
          initialValue={get(defaultValues, ['uiConfig', 'submitFields', 1], 'EndDate')}
          hidden
        >
          <Input disabled />
        </FormItem>
      </>
    );
  }
}

export default PropsForm;
