import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { get } from 'lodash';
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
    const { form, parentData } = this.props;

    return {
      form,
      name: 'dataName',
      store: {
        type: 'GET',
        autoLoad: false,
        url: `${MDMSCONTEXT}/appSubscription/getUnassigned?appCode=${parentData.code}`,
      },
      columns: [
        {
          title: '代码',
          width: 120,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 160,
          dataIndex: 'name',
        },
        {
          title: '描述',
          width: 200,
          dataIndex: 'remark',
        },
      ],
      rowKey: 'code',
      reader: {
        name: 'name',
        field: ['code'],
      },
      field: ['dataCode'],
    };
  };

  render() {
    const { form, editData, onCancel, saving, visible, parentData } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新建';

    return (
      <ExtModal
        destroyOnClose
        onCancel={onCancel}
        visible={visible}
        centered
        width={600}
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="" hidden>
            {getFieldDecorator('appCode', {
              initialValue: parentData && parentData.code,
            })(<Input disabled={!!parentData} />)}
          </FormItem>
          <FormItem label="订阅主数据代码" hidden>
            {getFieldDecorator('dataCode', {
              initialValue: get(editData, 'dataCode', ''),
            })(<Input />)}
          </FormItem>
          <FormItem label="订阅主数据">
            {getFieldDecorator('dataName', {
              initialValue: get(editData, 'dataName', ''),
              rules: [
                {
                  required: true,
                  message: '请选择订阅数据',
                },
              ],
            })(<ComboGrid disabled={!!editData} {...this.getDsComboGridProps()} />)}
          </FormItem>
          <FormItem label="拥有者名称">
            {getFieldDecorator('ownerName', {
              initialValue: get(editData, 'ownerName', ''),
            })(<Input />)}
          </FormItem>
          <FormItem label="拥有者邮箱">
            {getFieldDecorator('ownerEmail', {
              initialValue: get(editData, 'ownerEmail', ''),
              rules: [
                {
                  type: 'email',
                  message: '请输入正确的邮箱',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="备注">
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
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
