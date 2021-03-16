import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal, ScrollBar } from 'suid';
import { userUtils } from '@/utils';

const { getCurrentUser } = userUtils;
const FormItem = Form.Item;

@Form.create()
class FormModal extends PureComponent {
  onFormSubmit = _ => {
    const { form, save } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, saving, visible, onCancel, rowData, dictType } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const title = rowData ? '编辑' : formatMessage({ id: 'global.add', defaultMessage: '新建' });
    const { id, tenantCode, dataName, rank, dataValue, remark, frozen = false } = rowData || {};
    const userInfo = getCurrentUser();
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
        width={500}
        okText="保存"
      >
        <div
          style={{
            height: 320,
          }}
        >
          <ScrollBar>
            <Form style={{ padding: '0 10px' }} {...formItemLayout} layout="horizontal">
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('id', {
                  initialValue: id,
                })(<Input />)}
              </FormItem>
              <FormItem label="数据字典类型Id" style={{ display: 'none' }}>
                {getFieldDecorator('dataDictId', {
                  initialValue: dictType && dictType.id,
                })(<Input />)}
              </FormItem>
              <FormItem
                label="租户代码"
                style={{
                  display: 'none',
                }}
              >
                {getFieldDecorator('tenantCode', {
                  initialValue: userInfo.tenantCode || tenantCode,
                })(<Input />)}
              </FormItem>
              <FormItem label="展示值">
                {getFieldDecorator('dataName', {
                  initialValue: dataName,
                  rules: [
                    {
                      required: true,
                      message: '展示值不能为空',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="使用值">
                {getFieldDecorator('dataValue', {
                  initialValue: dataValue,
                  rules: [
                    {
                      required: true,
                      message: '值不能为空',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="描述">
                {getFieldDecorator('remark', {
                  initialValue: remark,
                })(<Input />)}
              </FormItem>
              <FormItem label="排序">
                {getFieldDecorator('rank', {
                  initialValue: rank,
                })(<Input />)}
              </FormItem>
              <FormItem label="冻结">
                {getFieldDecorator('frozen', {
                  valuePropName: 'checked',
                  initialValue: frozen,
                })(<Switch size="small" />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
