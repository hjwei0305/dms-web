import React from 'react';
import { Form, Switch, Select, Input, Tag } from 'antd';
import { get } from 'lodash';
import { ComboList, ScrollBar, ProLayout } from 'suid';
import { constants, validateRules } from '@/utils';
import ExtComboTableUiConfig from './ExtComboTableUiConfig';

const { Header, Content } = ProLayout;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};
const { MDMSCONTEXT } = constants;

@Form.create({
  onValuesChange: ({ onValuesChange }, _, allValues) => {
    if (onValuesChange) {
      onValuesChange(allValues, _);
    }
  },
})
class EditForm extends React.Component {
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
        url: `${MDMSCONTEXT}/dataDefinition/getRegisterDataByPage`,
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

  handleRuleSelected = rule => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({
      'message.pattern': validateRules[rule].message,
    });
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
        <FormItem label="校验规则">
          {getFieldDecorator('pattern', {
            initialValue: get(editData[optKey], 'pattern'),
          })(
            <Select onSelect={this.handleRuleSelected}>
              {Object.keys(validateRules).map(ruleKey => {
                const { title } = validateRules[ruleKey];
                return (
                  <Select.Option key={ruleKey} value={ruleKey}>
                    {title}
                  </Select.Option>
                );
              })}
            </Select>,
          )}
        </FormItem>
        <FormItem label="校验规则信息">
          {getFieldDecorator('message.pattern', {
            initialValue: get(editData[optKey], 'message.pattern'),
          })(<Input />)}
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
    const { editData, optKey } = this.props;
    const [, { title }] = editData;
    let tagText = '新建表单';
    if (optKey === '2') {
      tagText = '编辑表单';
    }

    if (optKey === '3') {
      tagText = '新增根表单';
    }

    return (
      <ProLayout>
        <Header
          height={47}
          title="表单项配置"
          subTitle={title}
          tags={[<Tag color="blue">{tagText}</Tag>]}
        />
        <Content style={{ padding: '0 8px' }}>
          <ScrollBar>{this.getContent()}</ScrollBar>
        </Content>
      </ProLayout>
    );
  }
}

export default EditForm;
