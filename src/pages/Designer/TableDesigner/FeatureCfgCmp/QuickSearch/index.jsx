import React from 'react';
import { Form, Input, Select, Switch } from 'antd';
import { useGlobal } from '../../hooks';

const FormItem = Form.Item;

const QuickSearch = ({ form }) => {
  const { getFieldDecorator } = form;
  const [{ showSearch, searchPlaceHolder, searchProperties }, dispatch] = useGlobal();

  return (
    <Form layout="vertical" style={{ width: 500 }}>
      <FormItem label="启用快查">
        {getFieldDecorator('showSearch', {
          valuePropName: 'checked',
          initialValue: showSearch,
        })(
          <Switch
            onChange={value => {
              dispatch({
                showSearch: value,
              });
            }}
          />,
        )}
      </FormItem>
      <FormItem label="查询属性">
        {getFieldDecorator('searchProperties', {
          initialValue: searchProperties,
        })(
          <Select
            open={false}
            mode="tags"
            disabled={!showSearch}
            tokenSeparators={[',']}
            placeholder="快速查询属性，多个用逗号隔开"
            onChange={value => {
              dispatch({
                searchProperties: value,
              });
            }}
          />,
        )}
      </FormItem>
      <FormItem label="查询占位">
        {getFieldDecorator('searchPlaceHolder', {
          initialValue: searchPlaceHolder,
        })(
          <Input
            disabled={!showSearch}
            onChange={e => {
              dispatch({
                searchPlaceHolder: e.target.value,
              });
            }}
          />,
        )}
      </FormItem>
    </Form>
  );
};

export default Form.create()(QuickSearch);
