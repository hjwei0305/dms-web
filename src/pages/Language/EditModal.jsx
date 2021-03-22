import React, { PureComponent } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { ExtModal } from 'suid';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  handleSave = _ => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      console.log(params);
      onSave && onSave(params);
    });
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';
    const { code, name, baseCode, rank = 0 } = editData || {};
    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="代码">
            {getFieldDecorator('code', {
              initialValue: code,
              rules: [
                {
                  required: true,
                  message: '代码不能为空',
                },
                {
                  max: 5,
                  message: '代码不能超过5个字符',
                },
              ],
            })(<Input disabled={!!editData} />)}
          </FormItem>
          <FormItem label="名称">
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="基础语言码">
            {getFieldDecorator('baseCode', {
              initialValue: baseCode,
              rules: [
                {
                  required: true,
                  message: '基础语言码不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('rank', {
              initialValue: rank,
            })(<InputNumber style={{ width: '100%' }} min={0} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
