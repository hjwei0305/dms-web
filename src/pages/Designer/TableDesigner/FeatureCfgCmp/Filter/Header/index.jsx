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
const colSpan = 12;

const Header = ({ form }) => {
  const [{ filter }] = useGlobal();
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
          <FormItem label="表单布局">
            {getFieldDecorator('colSpan', {
              initialValue: get(filter, 'colSpan', 24),
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
              initialValue: get(filter, 'layout', 'horizontal'),
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
