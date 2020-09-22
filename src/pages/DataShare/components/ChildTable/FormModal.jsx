import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { omit } from 'lodash';
import { ExtModal, ComboGrid } from 'suid';
import { constants } from '@/utils';
import ExtTransfer from '../ExtTransfer';
import { getPropertiesByCode } from '../../service.js';

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
  state = {
    fieldLists: [],
  };

  componentDidMount() {
    this.getPropertiesByCode();
  }

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

  getPropertiesByCode = () => {
    const { parentData } = this.props;

    return getPropertiesByCode({
      code: parentData.code,
    }).then(result => {
      const { success, data } = result;
      if (success) {
        this.setState({
          fieldLists: data || [],
        });
      }
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
    const { fieldLists } = this.state;
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
        okText="保存"
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="主数据代码" style={{ display: 'none' }}>
            {getFieldDecorator('masterCode', {
              initialValue: parentData && parentData.code,
            })(<Input disabled={!!parentData} />)}
          </FormItem>
          <FormItem label="业务模块">
            {getFieldDecorator('businessModule', {
              initialValue: '',
            })(<ComboGrid {...this.getDsComboGridProps()} />)}
          </FormItem>
          <FormItem label="分享字段">
            {getFieldDecorator('shareFields', {
              initialValue: [],
            })(<ExtTransfer itemList={fieldLists} />)}
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
