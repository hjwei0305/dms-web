import React, { PureComponent } from 'react';
import { Form, Switch } from 'antd';
import { get } from 'lodash';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 11,
  },
};

@Form.create()
class TableCfg extends PureComponent {
  handleSave = () => {
    const { form, editData, onSave } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        onSave({ ...editData, ...formData });
      }
    });
  };

  render() {
    const { editData, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form {...formItemLayout} layout="horizontal">
        {/* <FormItem label="请求类型">
            {getFieldDecorator('store.type', {
              initialValue: get(editData, 'store.type'),
              rules: [
                {
                  required: true,
                  message: '请求类型不能为空',
                },
              ],
            })(
              <Select>
                <Select.Option value="GET">GET</Select.Option>
                <Select.Option value="POST">POST</Select.Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="请求地址">
            {getFieldDecorator('store.url', {
              initialValue: get(editData, 'store.url'),
              rules: [
                {
                  required: true,
                  message: '请求地址不能为空',
                },
              ],
            })(<Input />)}
          </FormItem> */}
        <FormItem label="边框">
          {getFieldDecorator('bordered', {
            valuePropName: 'checked',
            initialValue: get(editData, 'bordered'),
          })(
            <Switch
              onChange={bordered => {
                const { onEditTable } = this.props;
                if (onEditTable) {
                  onEditTable({
                    bordered,
                  });
                }
              }}
            />,
          )}
        </FormItem>
        <FormItem label="自定义列">
          {getFieldDecorator('allowCustomColumns', {
            valuePropName: 'checked',
            initialValue: get(editData, 'allowCustomColumns'),
          })(
            <Switch
              onChange={allowCustomColumns => {
                const { onEditTable } = this.props;
                if (onEditTable) {
                  onEditTable({
                    allowCustomColumns,
                  });
                }
              }}
            />,
          )}
        </FormItem>
        <FormItem label="查询文本提示">
          {getFieldDecorator('showSearchTooltip', {
            valuePropName: 'checked',
            initialValue: get(editData, 'showSearchTooltip'),
          })(
            <Switch
              onChange={showSearchTooltip => {
                const { onEditTable } = this.props;
                if (onEditTable) {
                  onEditTable({
                    showSearchTooltip,
                  });
                }
              }}
            />,
          )}
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('remotePaging', {
            valuePropName: 'checked',
            initialValue: get(editData, 'remotePaging'),
          })(<Switch />)}
        </FormItem>
      </Form>
    );
  }
}

export default TableCfg;
