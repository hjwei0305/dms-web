import React from 'react';
import { Input, Row, Col, Select, Switch } from 'antd';
import { get } from 'lodash';
import Form from '@/components/ExtForm';

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

const Header = ({ onValuesChange }) => {
  const [config] = useGlobal();
  return (
    <Form
      {...formLayout}
      style={{
        flex: 1,
        paddingRight: 10,
      }}
      layout="horizontal"
      onValuesChange={onValuesChange}
    >
      <Row
        style={{
          marginTop: 24,
        }}
      >
        <Col span={colSpan}>
          <FormItem
            label="请求类型"
            name="store.type"
            initialValue={get(config, 'store.type', 'POST')}
          >
            <Select>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="GET">GET</Select.Option>
              <Select.Option value="DELETE">DELETE</Select.Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem
            label="请求地址"
            name="store.url"
            initialValue={get(config, 'store.url', '')}
            rules={[
              {
                required: true,
                message: '请输入请求地址',
              },
            ]}
          >
            <Input />
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem
            labelCol={{
              span: 12,
            }}
            wrapperCol={{
              span: 12,
            }}
            label="刷新"
            name="showRefresh"
            valuePropName="checked"
            initialValue={get(config, 'showRefresh', true)}
          >
            <Switch />
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem
            labelCol={{
              span: 12,
            }}
            wrapperCol={{
              span: 12,
            }}
            label="远程分页"
            name="remotePaging"
            valuePropName="checked"
            initialValue={get(config, 'remotePaging', true)}
          >
            <Switch />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};

export default Header;
