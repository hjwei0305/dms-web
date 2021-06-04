import React, { PureComponent } from 'react';
import { Input } from 'antd';
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
        <FormItem label="代码">
          {getFieldDecorator('code', {
            initialValue: get(editData, 'code'),
            rules: [
              {
                required: true,
                message: '请输入代码',
              },
            ],
          })(<Input disabled={!!editData} />)}
        </FormItem>
        <FormItem label="名称">
          {getFieldDecorator('name', {
            initialValue: get(editData, 'name'),
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="账户组">
          {getFieldDecorator('accountGroup', {
            initialValue: get(editData, 'accountGroup'),
          })(<Input />)}
        </FormItem>
        <FormItem label="城市">
          {getFieldDecorator('city', {
            initialValue: get(editData, 'city'),
          })(<Input />)}
        </FormItem>
        <FormItem label="邮编">
          {getFieldDecorator('postCode', {
            initialValue: get(editData, 'postCode'),
          })(<Input />)}
        </FormItem>
        <FormItem label="街道">
          {getFieldDecorator('street', {
            initialValue: get(editData, 'street'),
          })(<Input />)}
        </FormItem>
        <FormItem label="单位地址">
          {getFieldDecorator('address', {
            initialValue: get(editData, 'address'),
          })(<Input />)}
        </FormItem>
        <FormItem label="纳税人识别号">
          {getFieldDecorator('taxNumber', {
            initialValue: get(editData, 'taxNumber'),
          })(<Input />)}
        </FormItem>
        <FormItem label="电话">
          {getFieldDecorator('telephone', {
            initialValue: get(editData, 'telephone'),
          })(<Input />)}
        </FormItem>
      </>
    );
  };

  render() {
    const { children, editData, isSaving } = this.props;
    const subTitle = editData ? '编辑' : '新增';
    return (
      <FormPopover
        title="供应商"
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
