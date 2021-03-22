import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal, ScrollBar } from 'suid';

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
    const { id, className, propertyName, remark } = rowData || {};

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
              <FormItem label="业务实体全类名">
                {getFieldDecorator('className', {
                  initialValue: className,
                  rules: [
                    {
                      required: true,
                      message: '业务实体全类名不能为空',
                    },
                  ],
                })(<Input disabled={!!rowData} />)}
              </FormItem>
              <FormItem label="属性名">
                {getFieldDecorator('propertyName', {
                  initialValue: propertyName,
                  rules: [
                    {
                      required: true,
                      message: '属性名不能为空',
                    },
                  ],
                })(<Input disabled={!!rowData} />)}
              </FormItem>
              <FormItem label="描述">
                {getFieldDecorator('remark', {
                  initialValue: remark,
                })(<Input />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
