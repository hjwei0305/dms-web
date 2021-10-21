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
          label="显示值"
          name="uiConfig.extra"
          initialValue={get(defaultValues, 'uiConfig.extra')}
          hidden
        >
          <Input disabled />
        </FormItem>
      </>
    );
  }
}

export default PropsForm;
