import React, { Component } from 'react';
import { Input, Form, Button } from 'antd';
import { get, omit } from 'lodash';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

@Form.create({})
class EditForm extends Component {
  getSelectOptions = () => {};

  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        Object.assign(editData[0], omit(formData, 'name'));
        onSave(editData);
      }
    });
  };

  render() {
    const { form, editData } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form {...formItemLayout}>
        <FormItem label="名称">
          {getFieldDecorator('name', {
            initialValue: get(editData[0], 'name'),
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="别名">
          {getFieldDecorator('title', {
            initialValue: get(editData[1], 'title') || get(editData[0], 'name'),
          })(<Input />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleSave}>
            保存
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default EditForm;
