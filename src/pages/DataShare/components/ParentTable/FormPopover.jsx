import React, { PureComponent } from 'react';
import { Input, Switch } from 'antd';
import { get } from 'lodash';
import FormPopover from '@/components/FormPopover';

class FormModal extends PureComponent {
  handleSave = (values, cb) => {
    const { onSave, editData } = this.props;
    const params = {};
    Object.assign(params, editData, values);
    onSave(params, cb);
  };

  handleRenderFormItems = (form, FormItem) => {
    const { editData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <FormItem label="应用代码">
          {getFieldDecorator('code', {
            initialValue: get(editData, 'code'),
            rules: [
              {
                required: true,
                message: '请输入应用代码',
              },
            ],
          })(<Input disabled={!!editData} />)}
        </FormItem>
        <FormItem label="应用名称">
          {getFieldDecorator('name', {
            initialValue: get(editData, 'name'),
            rules: [
              {
                required: true,
                message: '请输入应用名称',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="应用描述">
          {getFieldDecorator('remark', {
            initialValue: get(editData, 'remark'),
          })(<Input.TextArea />)}
        </FormItem>
        <FormItem label="冻结">
          {getFieldDecorator('frozen', {
            valuePropName: 'checked',
            initialValue: get(editData, 'frozen'),
          })(<Switch />)}
        </FormItem>
      </>
    );
  };

  render() {
    const { children, editData, isSaving } = this.props;
    const subTitle = editData ? '编辑' : '新增';
    return (
      <FormPopover
        title="应用模块"
        subTitle={subTitle}
        confirmLoading={isSaving}
        renderFormItems={this.handleRenderFormItems}
        onOk={this.handleSave}
      >
        {children}
      </FormPopover>
    );
  }
}

export default FormModal;
