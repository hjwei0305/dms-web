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
        <FormItem label="科目代码">
          {getFieldDecorator('code', {
            initialValue: get(editData, 'code'),
            rules: [
              {
                required: true,
                message: '请输入科目代码',
              },
            ],
          })(<Input disabled={!!editData} />)}
        </FormItem>
        <FormItem label="科目名称">
          {getFieldDecorator('name', {
            initialValue: get(editData, 'name'),
            rules: [
              {
                required: true,
                message: '请输入科目名称',
              },
            ],
          })(<Input />)}
        </FormItem>
        {/* <FormItem label="冻结">
          {getFieldDecorator('frozen', {
            valuePropName: 'checked',
            initialValue: get(editData, 'frozen'),
          })(<Switch />)}
        </FormItem> */}
      </>
    );
  };

  render() {
    const { children, editData, isSaving } = this.props;
    const subTitle = editData ? '编辑' : '新增';
    return (
      <FormPopover
        title="总账科目"
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
