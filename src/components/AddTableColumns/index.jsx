import React from 'react';
import { isArray } from 'lodash';
import { Button, Icon, Select, Input, Slider, List } from 'antd';
import PopoverForm from '../PopoverForm';

const AddTableColumns = props => {
  const { value = [], onChange } = props;
  console.log('value', value);
  if (!isArray(value)) {
    return '值必须是数组';
  }

  return (
    <div>
      <PopoverForm
        title="添加"
        onOk={val => {
          if (onChange) {
            onChange([val]);
          }
        }}
        renderFormItems={(_, FormItem) => {
          return (
            <>
              <FormItem
                label="数据索引"
                name="dataIndex"
                // initialValue={get(currData, 'dataIndex')}
                rules={[
                  {
                    required: true,
                    message: '请输入数据索引',
                  },
                ]}
              >
                <Input />
              </FormItem>
              {/* <FormItem
                label="显示列"
                name="originalName"
                initialValue={get(currData, 'originalName')}
                rules={[
                  {
                    required: true,
                    message: '请选择显示列',
                  },
                ]}
              >
                <ComboList {...getComboListProps(form)} />
              </FormItem> */}
              <FormItem
                label="列名"
                name="title"
                // initialValue={get(currData, 'title')}
                rules={[
                  {
                    required: true,
                    message: '请输入列名',
                  },
                ]}
              >
                <Input />
              </FormItem>
              <FormItem label="列宽" name="width" initialValue={120}>
                <Slider max={300} min={60} />
              </FormItem>
              <FormItem label="对齐方式" name="align" initialValue="left">
                <Select>
                  <Select.Option value="left">居左</Select.Option>
                  <Select.Option value="center">居中</Select.Option>
                  <Select.Option value="right">居右</Select.Option>
                </Select>
              </FormItem>
            </>
          );
        }}
      >
        <Button
          type="dashed"
          onClick={() => {
            console.log('test');
          }}
          style={{ width: '100%' }}
        >
          <Icon type="plus" /> 添加
        </Button>
      </PopoverForm>
      {!!value.length && (
        <List
          dataSource={value}
          renderItem={item => {
            return (
              <List.Item
                actions={[
                  // <PopoverForm>
                  //   <a key="edit">编辑</a>
                  // </PopoverForm>,
                  <a
                    key="delete"
                    onClick={() => {
                      if (onChange) {
                        onChange(value.filter(it => it.dataIndex !== item.dataIndex));
                      }
                    }}
                  >
                    删除
                  </a>,
                ]}
              >
                <List.Item.Meta
                  // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={item.title}
                  description={item.dataIndex}
                />
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
};

export default AddTableColumns;
