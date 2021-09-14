import React from 'react';
import { Form, Input, Row, Col, Select } from 'antd';
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
  const [{ edit }] = useGlobal();
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
            {getFieldDecorator('method', {
              initialValue: get(edit, 'method', 'POST'),
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
            {getFieldDecorator('url', {
              initialValue: get(edit, 'url', ''),
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
          <FormItem label="表单布局">
            {getFieldDecorator('colSpan', {
              initialValue: get(edit, 'colSpan', 24),
              rules: [
                {
                  required: true,
                  message: '请选择表单布局',
                },
              ],
            })(
              <Select>
                <Select.Option value={24}>一行一列</Select.Option>
                <Select.Option value={12}>一行二列</Select.Option>
                <Select.Option value={8}>一行三列</Select.Option>
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="展示方式">
            {getFieldDecorator('layout', {
              initialValue: get(edit, 'layout', 'horizontal'),
              rules: [
                {
                  required: true,
                  message: '请选择展示方式',
                },
              ],
            })(
              <Select>
                <Select.Option value="horizontal">水平</Select.Option>
                <Select.Option value="vertical">垂直</Select.Option>
              </Select>,
            )}
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
