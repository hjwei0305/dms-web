import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ExtModal, ScrollBar, ComboGrid, ComboTree } from 'suid';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
const FormItem = Form.Item;

@Form.create()
class FormModal extends PureComponent {
  onFormSubmit = () => {
    const { form, onSave } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        onSave(formData);
      }
    });
  };

  getMtComboTreeProps = () => {
    const { form } = this.props;

    return {
      form,
      name: 'modelTypeName',
      store: {
        type: 'GET',
        autoLoad: false,
        url: `${MDMSCONTEXT}/dataModelType/getAllRootNode`,
      },
      columns: [
        {
          title: '代码',
          width: 80,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 200,
          dataIndex: 'name',
        },
      ],
      rowKey: 'id',
      reader: {
        name: 'name',
        field: ['code'],
      },
      field: ['modelTypeCode'],
      remotePaging: true,
    };
  };

  getDsComboGridProps = () => {
    const { form } = this.props;

    return {
      form,
      name: 'dsName',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/dataSource/findByPage`,
      },
      columns: [
        {
          title: '代码',
          width: 80,
          dataIndex: 'code',
        },
        {
          title: '描述',
          width: 200,
          dataIndex: 'remark',
        },
      ],
      rowKey: 'id',
      reader: {
        name: 'remark',
        field: ['id'],
      },
      field: ['dsId'],
      remotePaging: true,
    };
  };

  render() {
    const { form, saving, visible, onCancel, rowData } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const title = rowData ? '编辑' : '新建';
    const { id, modelTypeCode, modelTypeName, tableName, remark, dsId, dsName } = rowData || {};

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        confirmLoading={saving}
        title={title}
        onOk={() => {
          this.onFormSubmit();
        }}
        width={550}
        okText="保存"
      >
        <div>
          <ScrollBar>
            <Form style={{ padding: '0 10px' }} {...formItemLayout} layout="horizontal">
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('id', {
                  initialValue: id,
                })(<Input />)}
              </FormItem>
              <FormItem
                label="模型分类代码"
                style={{
                  display: 'none',
                }}
              >
                {getFieldDecorator('modelTypeCode', {
                  initialValue: modelTypeCode,
                })(<Input />)}
              </FormItem>
              <FormItem label="模型分类">
                {getFieldDecorator('modelTypeName', {
                  initialValue: modelTypeName,
                  rules: [
                    {
                      required: true,
                      message: '模型分类不能为空',
                    },
                  ],
                })(<ComboTree {...this.getMtComboTreeProps()} />)}
              </FormItem>
              <FormItem
                label="数据源Id"
                style={{
                  display: 'none',
                }}
              >
                {getFieldDecorator('dsId', {
                  initialValue: dsId,
                })(<Input />)}
              </FormItem>
              <FormItem label="数据源">
                {getFieldDecorator('dsName', {
                  initialValue: dsName,
                  rules: [
                    {
                      required: true,
                      message: '数据源不能为空',
                    },
                  ],
                })(<ComboGrid {...this.getDsComboGridProps()} />)}
              </FormItem>
              <FormItem label="表名">
                {getFieldDecorator('tableName', {
                  initialValue: tableName,
                  rules: [
                    {
                      required: true,
                      message: '表名不能为空',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="备注">
                {getFieldDecorator('remark', {
                  initialValue: remark,
                })(<Input.TextArea />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
