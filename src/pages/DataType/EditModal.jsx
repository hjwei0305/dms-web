import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
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
          <FormItem label="名称">
            {getFieldDecorator('name', {
              initialValue: editData && editData.name,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="长度">
            {getFieldDecorator('dataLength', {
              initialValue: editData && editData.dataLength,
              rules: [
                {
                  required: true,
                  message: '长度不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="精度">
            {getFieldDecorator('precison', {
              initialValue: editData && editData.precison,
              rules: [
                {
                  required: true,
                  message: '精度不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="java类型">
            {getFieldDecorator('javaType', {
              initialValue: editData && editData.javaType,
              rules: [
                {
                  required: true,
                  message: 'java类型不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="mysql类型">
            {getFieldDecorator('mysqlType', {
              initialValue: editData && editData.mysqlType,
              rules: [
                {
                  required: true,
                  message: 'mysql类型不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="postgresql类型">
            {getFieldDecorator('postgreType', {
              initialValue: editData && editData.postgreType,
              rules: [
                {
                  required: true,
                  message: 'postgresql类型不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="oraclesql类型">
            {getFieldDecorator('oracleType', {
              initialValue: editData && editData.oracleType,
              rules: [
                {
                  required: true,
                  message: 'oraclesql类型不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="mssql类型">
            {getFieldDecorator('mssqlType', {
              initialValue: editData && editData.mssqlType,
              rules: [
                {
                  required: true,
                  message: 'mssql类型不能为空',
                },
              ],
            })(<Input />)}
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
