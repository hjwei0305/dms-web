import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Switch } from 'antd';
import { ExtModal, ComboGrid } from 'suid';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
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
      onSave(params);
    });
  };

  getDsComboGridProps = () => {
    const { form } = this.props;

    return {
      form,
      name: 'dataTypeDesc',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/dataType/findByPage`,
      },
      columns: [
        {
          title: '代码',
          width: 120,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 200,
          dataIndex: 'name',
        },
        {
          title: '长度',
          width: 80,
          dataIndex: 'dataLength',
        },
        {
          title: '精度',
          width: 80,
          dataIndex: 'precision',
        },
      ],
      rowKey: 'id',
      reader: {
        name: 'name',
        field: ['code', 'precision', 'dataLength'],
      },
      field: ['dataType', 'precision', 'dataLength'],
      remotePaging: true,
    };
  };

  render() {
    const { form, editData, onClose, saving, visible, parentData } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新建';

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        okText="保存"
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="模型Id" style={{ display: 'none' }}>
            {getFieldDecorator('dataModelId', {
              initialValue: parentData && parentData.id,
            })(<Input />)}
          </FormItem>
          <FormItem label="字段名称">
            {getFieldDecorator('fieldName', {
              initialValue: editData && editData.fieldName,
              rules: [
                {
                  required: true,
                  message: '字段名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="字段描述">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
              rules: [
                {
                  required: true,
                  message: '字段描述不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            label="数据类型code"
            style={{
              display: 'none',
            }}
          >
            {getFieldDecorator('dataType', {
              initialValue: editData && editData.dataType,
            })(<Input />)}
          </FormItem>
          <FormItem label="数据类型">
            {getFieldDecorator('dataTypeDesc', {
              initialValue: editData && editData.dataTypeDesc,
              rules: [
                {
                  required: true,
                  message: '数据类型不能为空',
                },
              ],
            })(<ComboGrid {...this.getDsComboGridProps()} />)}
          </FormItem>
          <FormItem label="长度">
            {getFieldDecorator('dataLength', {
              initialValue: editData && editData.dataLength,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="精度">
            {getFieldDecorator('precision', {
              initialValue: editData && editData.precision,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="是否不为空">
            {getFieldDecorator('notNull', {
              valuePropName: 'checked',
              initialValue: editData && editData.notNull,
            })(<Switch />)}
          </FormItem>
          {form.getFieldValue('notNull') ? (
            <FormItem label="默认值">
              {getFieldDecorator('defaultValue', {
                initialValue: editData && editData.defaultValue,
                rules: [
                  {
                    required: true,
                    message: '默认值不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
          ) : null}
          <FormItem label="是否是外键">
            {getFieldDecorator('primaryKey', {
              valuePropName: 'checked',
              initialValue: editData && editData.primaryKey,
            })(<Switch />)}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('rank', {
              initialValue: editData ? editData.rank : 0,
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
