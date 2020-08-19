import React from 'react';
import { Form, InputNumber, Select } from 'antd';
import { ExtModal } from 'suid';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

@Form.create()
class EditModal extends React.Component {
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        onSave({ ...editData, ...formData });
      }
    });
  };

  getContent = () => {
    const { form, editData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form {...formItemLayout}>
        <FormItem label="标签宽度">
          {getFieldDecorator('width', {
            initialValue: editData && editData.width,
          })(<InputNumber style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="值格式化">
          {getFieldDecorator('formatter', {
            initialValue: editData && editData.formatter,
          })(
            <Select>
              <Select.Option value="text">文本</Select.Option>
              <Select.Option value="date">日期</Select.Option>
            </Select>,
          )}
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
  };

  render() {
    const { editData, onCancel } = this.props;
    const { name } = editData;

    return (
      <ExtModal
        visible={!!editData}
        title={`编辑字段【${name}】`}
        onCancel={onCancel}
        onOk={this.handleSave}
      >
        {this.getContent()}
      </ExtModal>
    );
  }
}

export default EditModal;
