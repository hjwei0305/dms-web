import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { ExtModal } from 'suid';

const { TextArea } = Input;
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
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
      }
    });
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

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
              initialValue: editData && editData.code,
              rules: [
                {
                  required: true,
                  message: '代码不能为空',
                },
                {
                  max: 10,
                  message: '代码不能超过5个字符',
                },
              ],
            })(<Input disabled={!!editData} />)}
          </FormItem>
          <FormItem label="描述">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
              rules: [
                {
                  required: true,
                  message: '描述不能为空',
                },
              ],
            })(<TextArea />)}
          </FormItem>
          <FormItem label="数据库类型">
            {getFieldDecorator('dbType', {
              initialValue: editData && editData.dbType,
              rules: [
                {
                  required: true,
                  message: '数据库类型不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="url地址">
            {getFieldDecorator('url', {
              initialValue: editData && editData.url,
              rules: [
                {
                  required: true,
                  message: 'url地址不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="用户名">
            {getFieldDecorator('username', {
              initialValue: editData && editData.username,
              rules: [
                {
                  required: true,
                  message: '用户名不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="密码">
            {getFieldDecorator('password', {
              initialValue: editData && editData.password,
              rules: [
                {
                  required: true,
                  message: '密码不能为空',
                },
              ],
            })(<Input.Password />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              valuePropName: 'checked',
              initialValue: editData && editData.frozen,
            })(<Switch />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
