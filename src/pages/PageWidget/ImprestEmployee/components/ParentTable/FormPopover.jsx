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
        <FormItem label="名称缩写">
          {getFieldDecorator('shortName', {
            initialValue: get(editData, 'shortName'),
          })(<Input />)}
        </FormItem>
        <FormItem label="	员工编号">
          {getFieldDecorator('personnelCode', {
            initialValue: get(editData, 'personnelCode'),
          })(<Input />)}
        </FormItem>
        <FormItem label="身份证">
          {getFieldDecorator('idCard', {
            initialValue: get(editData, 'idCard'),
          })(<Input />)}
        </FormItem>
        <FormItem label="移动电话">
          {getFieldDecorator('mobile', {
            initialValue: get(editData, 'mobile'),
          })(<Input />)}
        </FormItem>
        <FormItem label="说明">
          {getFieldDecorator('remark', {
            initialValue: get(editData, 'remark'),
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
        title="备用金员工"
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
