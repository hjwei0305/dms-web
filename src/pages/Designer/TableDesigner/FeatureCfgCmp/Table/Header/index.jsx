import React from 'react';
import { Form, Input, Row, Col, Select, Switch } from 'antd';
import { get } from 'lodash';

import { useGlobal } from '../../../hooks';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

// const formItemLayout = {
//   labelCol: {
//     span: 2,
//   },
//   wrapperCol: {
//     span: 22,
//   },
// };

const colSpan = 8;

const Header = ({ form }) => {
  const [config] = useGlobal();
  const { getFieldDecorator } = form;
  return (
    <Form
      {...formLayout}
      style={{
        flex: 1,
        paddingRight: 10,
      }}
      layout="horizontal"
    >
      <Row
        style={{
          marginTop: 24,
        }}
      >
        <Col span={colSpan}>
          <FormItem label="请求类型">
            {getFieldDecorator('store.type', {
              initialValue: get(config, 'store.type', 'POST'),
            })(
              <Select>
                <Select.Option value="POST">POST</Select.Option>
                <Select.Option value="GET">GET</Select.Option>
                <Select.Option value="DELETE">DELETE</Select.Option>
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="请求地址">
            {getFieldDecorator('store.url', {
              initialValue: get(config, 'store.url', ''),
              rules: [
                {
                  required: true,
                  message: '请输入请求地址',
                },
              ],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="刷新">
            {getFieldDecorator('showRefresh', {
              valuePropName: 'checked',
              initialValue: get(config, 'showRefresh', true),
            })(<Switch />)}
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="远程分页">
            {getFieldDecorator('remotePaging', {
              valuePropName: 'checked',
              initialValue: get(config, 'remotePaging', true),
            })(<Switch />)}
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create({
  onValuesChange: ({ onValuesChange }, _, allValues) => {
    if (onValuesChange) {
      onValuesChange(allValues, _);
    }
  },
})(Header);
