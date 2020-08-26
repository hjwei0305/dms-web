import React, { Component } from 'react';
import { Input, Form, Switch, Button, Select } from 'antd';
import { get } from 'lodash';

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
        Object.assign(editData, formData);
        onSave(editData);
      }
    });
  };

  render() {
    const { form, editData, mapFieldLists } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form {...formItemLayout}>
        {/* <FormItem label="代码">
          {getFieldDecorator('code', {
            initialValue: get(editData, 'code'),
          })(<Input disabled />)}
        </FormItem> */}
        <FormItem label="名称">
          {getFieldDecorator('name', {
            initialValue: get(editData, 'name'),
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="是否隐藏列">
          {getFieldDecorator('hidden', {
            valuePropName: 'checked',
            initialValue: get(editData, 'hidden'),
          })(<Switch />)}
        </FormItem>
        <FormItem label="显示字段">
          {getFieldDecorator('isShowField', {
            valuePropName: 'checked',
            initialValue: get(editData, 'isShowField'),
          })(<Switch />)}
        </FormItem>
        <FormItem label="是否提交">
          {getFieldDecorator('isSubmit', {
            valuePropName: 'checked',
            initialValue: get(editData, 'isSubmit'),
          })(<Switch />)}
        </FormItem>
        {getFieldValue('isSubmit') ? (
          <FormItem label="对应提交字段">
            {getFieldDecorator('sumitField', {
              initialValue: get(editData, 'sumitField'),
              rules: [
                {
                  required: true,
                  message: '对应提交字段不能为空',
                },
              ],
            })(
              <Select>
                {mapFieldLists.map(it => {
                  const { code, name } = it;
                  return (
                    <Select.Option key={code} value={code}>
                      {name}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </FormItem>
        ) : null}
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
