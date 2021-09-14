import React, { PureComponent } from 'react';
import { Switch, InputNumber, Select } from 'antd';
import FormPopover from '@/components/FormPopover';

class FormModal extends PureComponent {
  handleSave = (values, cb) => {
    const { onSave, editData } = this.props;
    const params = {};
    Object.assign(params, editData, values);
    onSave(params, () => {
      cb(false);
    });
  };

  handleRenderFormItems = (form, FormItem) => {
    const { editData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
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
      </>
    );
  };

  render() {
    const { children, editData } = this.props;
    const { title } = editData;
    const subTitle = editData ? '编辑' : '新增';
    return (
      <FormPopover
        title={title}
        subTitle={subTitle}
        renderFormItems={this.handleRenderFormItems}
        onOk={this.handleSave}
      >
        {children}
      </FormPopover>
    );
  }
}

export default FormModal;
