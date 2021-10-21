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
    const { defaultValues } = this.props;

    return (
      <>
        <FormItem
          label="数字属性"
          name="uiConfig.extra"
          hidden
          initialValue={get(defaultValues, 'uiConfig.extra')}
        >
          <Input />
        </FormItem>
      </>
    );
  }
}

export default PropsForm;
