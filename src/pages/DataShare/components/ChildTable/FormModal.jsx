import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { omit } from 'lodash';
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
      onSave(omit(params, 'register'));
    });
  };

  getDsComboGridProps = () => {
    const { form } = this.props;

    return {
      form,
      name: 'register',
      store: {
        type: 'GET',
        autoLoad: false,
        url: `${MDMSCONTEXT}/masterDataUiConfig/getAllMasterData`,
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
          title: '数据结构',
          width: 80,
          dataIndex: 'dataStructureEnumRemark',
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
        field: ['code', 'name', 'remark', 'dataStructure', 'dataStructureEnumRemark'],
      },
      field: ['code', 'name', 'remark', 'dataStructure', 'dataStructureEnumRemark'],
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
          <FormItem label="主数据分类代码" style={{ display: 'none' }}>
            {getFieldDecorator('typeCode', {
              initialValue: parentData && parentData.code,
            })(<Input disabled={!!parentData} />)}
          </FormItem>
          <FormItem label="主数据分类">
            {getFieldDecorator('typeName', {
              initialValue: parentData && parentData.name,
            })(<Input disabled={!!parentData} />)}
          </FormItem>
          <FormItem label="主数据" style={{ display: editData ? 'none' : '' }}>
            {getFieldDecorator('register', {
              initialValue: '',
            })(<ComboGrid {...this.getDsComboGridProps()} />)}
          </FormItem>
          <FormItem label="数据结构代码" style={{ display: 'none' }}>
            {getFieldDecorator('dataStructure', {
              initialValue: editData ? editData.dataStructure : '',
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="数据结构">
            {getFieldDecorator('dataStructureEnumRemark', {
              initialValue: editData ? editData.dataStructureEnumRemark : '',
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="主数据代码">
            {getFieldDecorator('code', {
              initialValue: editData ? editData.code : '',
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="主数据名称">
            {getFieldDecorator('name', {
              initialValue: editData ? editData.name : '',
            })(<Input />)}
          </FormItem>
          <FormItem label="主数据描述">
            {getFieldDecorator('remark', {
              initialValue: editData ? editData.remark : '',
            })(<Input.TextArea />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              valuePropName: 'checked',
              initialValue: editData ? editData.frozen : false,
            })(<Switch />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
