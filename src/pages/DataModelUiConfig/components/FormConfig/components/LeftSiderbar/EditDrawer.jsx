import React from 'react';
import { Form, Switch, Select, Input, Button, Drawer } from 'antd';
import { get } from 'lodash';
import { ComboList } from 'suid';
import { constants } from '@/utils';
import ExtComboTableUiConfig from './ExtComboTableUiConfig';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const { MDMSCONTEXT } = constants;

@Form.create()
class EditDrawer extends React.Component {
  handleSave = () => {
    const { form, onSave, editData, optKey } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        Object.assign(editData[optKey], formData);
        onSave(editData);
      }
    });
  };

  getComboListProps = () => {
    const { form } = this.props;
    return {
      form,
      name: 'ExtComboGrid.dataModelName',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/masterDataUiConfig/getRegisterDataByPage`,
      },
      rowKey: 'id',
      reader: {
        name: 'name',
        description: 'dataStructure',
        field: ['code'],
      },
      field: ['ExtComboGrid.dataModelCode'],
      remotePaging: true,
    };
  };

  getContent = () => {
    const { form, editData, fieldLists, optKey } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    return (
      <Form {...formItemLayout}>
        <FormItem label="别名">
          {getFieldDecorator('title', {
            initialValue: get(editData[optKey], 'title'),
          })(<Input />)}
        </FormItem>
        <FormItem label="表单类型">
          {getFieldDecorator('ui:widget', {
            initialValue: get(editData[optKey], 'ui:widget'),
          })(
            <Select>
              <Select.Option value="ExtInput">输入框</Select.Option>
              <Select.Option value="ExtInputNumber">数字框</Select.Option>
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
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('ExtComboGrid.dataModelCode', {
                initialValue: get(editData[optKey], 'ExtComboGrid.dataModelCode'),
              })(<Input />)}
            </FormItem>
            <FormItem label="关联数据源">
              {getFieldDecorator('ExtComboGrid.dataModelName', {
                initialValue: get(editData[optKey], 'ExtComboGrid.dataModelName'),
              })(<ComboList {...this.getComboListProps()} />)}
            </FormItem>
            {getFieldValue('ExtComboGrid.dataModelCode') ? (
              <FormItem label="下拉表格配置">
                {getFieldDecorator('ExtComboGrid.cfg', {
                  initialValue: get(editData[optKey], 'ExtComboGrid.cfg', []),
                })(
                  <ExtComboTableUiConfig
                    mapFieldLists={fieldLists}
                    dataModelCode={getFieldValue('ExtComboGrid.dataModelCode')}
                  />,
                )}
              </FormItem>
            ) : null}
            {/* <FormItem label="表格列">
              {getFieldDecorator('ExtComboGrid.columns', {
                initialValue: get(editData[optKey], 'ExtComboGrid.columns'),
              })(<Input />)}
            </FormItem>
            <FormItem label="显示字段">
              {getFieldDecorator('ExtComboGrid.showField', {
                initialValue: get(editData[optKey], 'ExtComboGrid.showField'),
              })(<Input />)}
            </FormItem>
            <FormItem label="提交字段">
              {getFieldDecorator('ExtComboGrid.submitFields', {
                initialValue: get(editData[optKey], 'ExtComboGrid.submitFields'),
              })(<Input />)}
            </FormItem> */}
          </>
        ) : null}
        {/* <FormItem label="格式化">
          {getFieldDecorator('format', {
            initialValue: get(editData[optKey], 'format'),
          })(<Select>
            <Select.Option value="date">日期</Select.Option>
          </Select>)}
        </FormItem> */}
        <FormItem label="是否必输">
          {getFieldDecorator('required', {
            valuePropName: 'checked',
            initialValue: get(editData[optKey], 'required'),
          })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
        </FormItem>
        <FormItem label="是否只读">
          {getFieldDecorator('ui:options.disabled', {
            valuePropName: 'checked',
            initialValue: get(editData[optKey], 'ui:options.disabled'),
          })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
        </FormItem>
        <FormItem label="是否隐藏">
          {getFieldDecorator('ui:hidden', {
            valuePropName: 'checked',
            initialValue: get(editData[optKey], 'ui:hidden'),
          })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
        </FormItem>
        <FormItem label="描述">
          {getFieldDecorator('description', {
            initialValue: get(editData[optKey], 'description'),
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
      <Drawer
        width={720}
        placement="left"
        title={`编辑表单元素【${title}】`}
        onClose={onCancel}
        visible={!!editData}
        bodyStyle={{ paddingBottom: 80 }}
        maskClosable={false}
      >
        {this.getContent()}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={this.handleSave} type="primary">
            保存
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default EditDrawer;
