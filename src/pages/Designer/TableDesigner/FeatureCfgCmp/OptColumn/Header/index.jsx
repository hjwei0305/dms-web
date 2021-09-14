import React from 'react';
import { Form, Input, Row, Col, Select, Slider, Switch } from 'antd';
import { get } from 'lodash';

import { useGlobal } from '../../../hooks';

const FormItem = Form.Item;

// const ALIGN = {
//   left: '居左',
//   center: '居中',
//   right: '居右',
// };

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
  const [{ optCol }] = useGlobal();
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
          <FormItem label="列标签">
            {getFieldDecorator('title', {
              initialValue: get(optCol, 'title', '操作'),
              rules: [
                {
                  required: true,
                  message: '请输入列标签',
                },
              ],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="列宽">
            {getFieldDecorator('width', {
              initialValue: get(optCol, 'width', 90),
            })(<Slider max={200} min={80} />)}
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="对齐方式">
            {getFieldDecorator('align', {
              initialValue: get(optCol, 'align', 'left'),
            })(
              <Select>
                <Select.Option value="left">居左</Select.Option>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="right">居右</Select.Option>
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="是否固定">
            {getFieldDecorator('fixed', {
              valuePropName: 'checked',
              initialValue: get(optCol, 'fixed', true),
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
