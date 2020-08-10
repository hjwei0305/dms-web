import React from 'react';
import { Form, Switch, Select, Input } from 'antd';
import { ExtModal } from 'suid';
import { get } from 'lodash';

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
        Object.assign(editData[1], formData);
        onSave(editData);
      }
    });
  };

  getContent = () => {
    const { form, editData } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    return (
      <Form {...formItemLayout}>
        <FormItem label="表单类型">
          {getFieldDecorator('ui:widget', {
            initialValue: get(editData[1], 'ui:widget'),
          })(
            <Select>
              <Select.Option value="ExtInput">输入框</Select.Option>
              <Select.Option value="ExtTextArea">文本框</Select.Option>
              <Select.Option value="ExtSwitch">布尔框</Select.Option>
              <Select.Option value="ExtDate">日期</Select.Option>
              {/* <Select.Option value="ExtRangeDate">日期区间</Select.Option> */}
              <Select.Option value="ExtComboGrid">下拉表格</Select.Option>
            </Select>,
          )}
        </FormItem>
        {getFieldValue('ui:widget') === 'ExtComboGrid' ? (
          <>
            <FormItem label="请求类型">
              {getFieldDecorator('ExtComboGrid.store.type', {
                initialValue: get(editData[1], 'ExtComboGrid.store.type', 'POST'),
              })(
                <Select>
                  <Select.Option value="POST">POST</Select.Option>
                  <Select.Option value="GET">GET</Select.Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="请求地址">
              {getFieldDecorator('ExtComboGrid.store.url', {
                initialValue: get(editData[1], 'ExtComboGrid.store.url'),
              })(<Input />)}
            </FormItem>
            <FormItem label="远程分页">
              {getFieldDecorator('ExtComboGrid.remotePaging', {
                valuePropName: 'checked',
                initialValue: get(editData[1], 'ExtComboGrid.remotePaging', true),
              })(<Switch />)}
            </FormItem>
            <FormItem label="表格列">
              {getFieldDecorator('ExtComboGrid.columns', {
                initialValue: get(editData[1], 'ExtComboGrid.columns'),
              })(<Input />)}
            </FormItem>
            <FormItem label="显示字段">
              {getFieldDecorator('ExtComboGrid.showField', {
                initialValue: get(editData[1], 'ExtComboGrid.showField'),
              })(<Input />)}
            </FormItem>
            <FormItem label="提交字段">
              {getFieldDecorator('ExtComboGrid.submitFields', {
                initialValue: get(editData[1], 'ExtComboGrid.submitFields'),
              })(<Input />)}
            </FormItem>
          </>
        ) : null}
        {/* <FormItem label="格式化">
          {getFieldDecorator('format', {
            initialValue: get(editData[1], 'format'),
          })(<Select>
            <Select.Option value="date">日期</Select.Option>
          </Select>)}
        </FormItem> */}
        <FormItem label="是否必输">
          {getFieldDecorator('required', {
            valuePropName: 'checked',
            initialValue: get(editData[1], 'required'),
          })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
        </FormItem>
        <FormItem label="描述">
          {getFieldDecorator('description', {
            initialValue: get(editData[1], 'description'),
          })(<Input />)}
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
    const [, { title }] = editData;

    return (
      <ExtModal
        visible={!!editData}
        title={`编辑表单元素【${title}】`}
        onCancel={onCancel}
        onOk={this.handleSave}
      >
        {this.getContent()}
      </ExtModal>
    );
  }
}

export default EditModal;
