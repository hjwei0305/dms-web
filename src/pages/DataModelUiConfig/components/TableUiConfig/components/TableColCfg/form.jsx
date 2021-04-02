import React, { PureComponent } from 'react';
import { Switch, InputNumber, Select, Form } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 13,
  },
};

@Form.create({
  onValuesChange: ({ onValuesChange }, _, allValues) => {
    if (onValuesChange) {
      onValuesChange(allValues, _);
    }
  },
})
class EditForm extends PureComponent {
  render() {
    const { editData, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form {...formItemLayout} layout="horizontal">
        <FormItem label="列宽">
          {getFieldDecorator('width', {
            initialValue: editData && editData.width,
          })(<InputNumber style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="格式化">
          {getFieldDecorator('formatter', {
            initialValue: editData && editData.formatter,
          })(
            <Select>
              <Select.Option value="formatText">文本</Select.Option>
              <Select.Option value="formatDate">日期</Select.Option>
              <Select.Option value="formatBool">布尔</Select.Option>
            </Select>,
          )}
        </FormItem>
        <FormItem
          label="快速查询"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {getFieldDecorator('canSearch', {
            valuePropName: 'checked',
            initialValue: editData && editData.canSearch,
          })(<Switch />)}
        </FormItem>
        <FormItem label="排序字段">
          {getFieldDecorator('sort', {
            valuePropName: 'checked',
            initialValue: editData && editData.sort,
          })(<Switch />)}
        </FormItem>
        {/* <FormItem label="支持复制" {...colFormItemLayout}>
          {getFieldDecorator('isCopy', {
            valuePropName: 'checked',
            initialValue: editData && editData.isCopy,
          })(<Switch />)}
        </FormItem> */}
        {/* <FormItem label="格式化" {...colFormItemLayout}>
          {getFieldDecorator('isFormatter', {
            valuePropName: 'checked',
            initialValue: editData && editData.isFormatter,
          })(<Switch />)}
        </FormItem> */}
      </Form>
    );
  }
}

export default EditForm;
