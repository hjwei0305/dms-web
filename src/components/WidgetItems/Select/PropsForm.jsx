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
        <FormItem label="数据源" name="options" initialValue={get(defaultValues, 'options')}>
          <Input />
        </FormItem>
      </>
    );
  }
}

export default PropsForm;
