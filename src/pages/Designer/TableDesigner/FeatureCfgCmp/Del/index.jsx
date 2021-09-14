import React from 'react';
import { Form, Input, Select } from 'antd';
import { get } from 'lodash';
import { useGlobal } from '../../hooks';

const FormItem = Form.Item;

const Del = ({ form }) => {
  const { getFieldDecorator } = form;
  const [{ del }, dispatch] = useGlobal();

  return (
    <Form layout="vertical" style={{ width: 400 }}>
      <FormItem label="请求方式">
        {getFieldDecorator('method', {
          initialValue: get(del, 'method', 'DELETE'),
        })(
          <Select
            onChange={value => {
              dispatch({
                del: {
                  ...(del || {}),
                  method: value,
                },
              });
            }}
          >
            <Select.Option value="POST">POST</Select.Option>
            <Select.Option value="GET">GET</Select.Option>
            <Select.Option value="DELETE">DELETE</Select.Option>
          </Select>,
        )}
      </FormItem>
      <FormItem label="请求地址">
        {getFieldDecorator('url', {
          initialValue: get(del, 'url', ''),
          rules: [
            {
              required: true,
              message: '请输入请求地址',
            },
          ],
        })(
          <Input
            onChange={e => {
              dispatch({
                del: {
                  ...(del || {}),
                  url: e.target.value,
                },
              });
            }}
          />,
        )}
      </FormItem>
    </Form>
  );
};

export default Form.create()(Del);
