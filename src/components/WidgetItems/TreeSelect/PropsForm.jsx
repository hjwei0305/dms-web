import React, { Component } from 'react';
import { Form, Input, Select, Switch } from 'antd';
import { get } from 'lodash';
import { constants } from '@/utils';

const { REQUEST_TYPE } = constants;

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
        <FormItem label="请求方式">
          {getFieldDecorator('store.type', {
            initialValue: get(defaultValues, ['store', 'type'], 'GET'),
            rules: [
              {
                required: true,
                message: '请选择请求方式',
              },
            ],
          })(
            <Select>
              {Object.keys(REQUEST_TYPE).map(key => (
                <Select.Option key={key} value={key}>
                  {key}
                </Select.Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="请求地址">
          {getFieldDecorator('store.url', {
            initialValue: get(defaultValues, 'store.url', ''),
            rules: [
              {
                required: true,
                message: '请输入请求地址',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="自定请求" hidden>
          {getFieldDecorator('store.autoLoad', {
            valuePropName: 'checked',
            initialValue: get(defaultValues, 'store.autoLoad', false),
          })(<Switch />)}
        </FormItem>
        <FormItem label="显示字段">
          {getFieldDecorator('showField', {
            initialValue: get(defaultValues, 'showField'),
            rules: [
              {
                required: true,
                message: '请输入显示字段',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="来源字段">
          {getFieldDecorator('originFields', {
            initialValue: get(defaultValues, 'originFields'),
          })(
            <Select
              open={false}
              mode="tags"
              tokenSeparators={[',']}
              placeholder="多个来源字段逗号隔开"
            />,
          )}
        </FormItem>
        <FormItem label="提交字段">
          {getFieldDecorator('submitFields', {
            initialValue: get(defaultValues, 'submitFields'),
          })(
            <Select
              open={false}
              mode="tags"
              tokenSeparators={[',']}
              placeholder="多个提交字段逗号隔开"
            />,
          )}
        </FormItem>
      </>
    );
  }
}

export default PropsForm;
