import React, { useState } from 'react';
import { get } from 'lodash';
import { Input, Select, Switch } from 'antd';
import { ComboList } from 'suid';
import ProTable from '@/components/ProTable';
import { constants } from '@/utils';
import validateRules from '@/utils/validateRules';
import formWidgetItems from '@/components/WidgetItems';

import { useGlobal } from '../../../hooks';

const { MDMSCONTEXT } = constants;

const Items = () => {
  const [drawerKey, setDrawerKey] = useState(null);
  const [{ add, _parentData }, dispatch] = useGlobal();
  const { formItems = [] } = add || {};

  const handleRuleSelected = () => {};

  const getComboListProps = form => {
    return {
      form,
      name: 'originalName',
      remotePaging: false,
      store: {
        type: 'GET',
        autoLoad: false,
        url: `${MDMSCONTEXT}/dataDefinition/getPropertiesByCode?code=${_parentData.code}`,
      },
      rowKey: 'id',
      reader: {
        name: 'name',
        description: 'code',
        field: ['code'],
      },
      field: ['name'],
      afterSelect: item => {
        if (item) {
          form.setFieldsValue({
            label: item.name,
          });
        }
      },
    };
  };

  const props = {
    rowKey: 'name',
    showRefresh: false,
    searchPlaceHolder: '请输入字段、标签',
    searchProperties: ['name', 'label'],
    toolBar: {
      prefix: '表单项',
    },
    columns: [
      {
        title: '组件',
        dataIndex: 'type',
        width: 150,
        render: type => formWidgetItems[type].desc,
      },
      {
        title: '字段',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '标签',
        dataIndex: 'label',
        width: 200,
      },
    ],
    dataSource: formItems,
    add: {
      api: async values => {
        dispatch({
          add: {
            ...(add || {}),
            formItems: formItems.concat([values]),
          },
        });
        return {
          success: true,
          message: '新建成功',
          data: values,
        };
      },
    },
    edit: {
      api: async values => {
        dispatch({
          add: {
            ...add,
            formItems: formItems.map(it => {
              if (values.name === it.name) {
                return values;
              }
              return it;
            }),
          },
        });
        return {
          success: true,
          message: '编辑成功',
          data: values,
        };
      },
    },
    del: {
      api: async values => {
        dispatch({
          add: {
            ...add,
            formItems: formItems.filter(({ name }) => values.name !== name),
          },
        });
        return {
          success: true,
          message: '删除成功',
          data: values,
        };
      },
    },
    drawerForm: {
      width: 450,
      render: (form, FormItem, currData) => {
        const { getFieldDecorator, getFieldValue } = form;
        const cmpType = getFieldValue('type') || get(currData, 'type', 'Input');
        const CmpFormItems = cmpType && formWidgetItems[cmpType].PropsForm;
        return (
          <>
            <FormItem label="字段代码" hidden>
              {getFieldDecorator('name', {
                initialValue: get(currData, 'name'),
              })(<Input />)}
            </FormItem>
            <FormItem label="字段">
              {getFieldDecorator('originalName', {
                initialValue: get(currData, 'originalName'),
                rules: [
                  {
                    required: true,
                    message: '请选择显示列',
                  },
                ],
              })(<ComboList {...getComboListProps(form)} />)}
            </FormItem>
            <FormItem label="别名">
              {getFieldDecorator('label', {
                initialValue: get(currData, 'label'),
                rules: [
                  {
                    required: true,
                    message: '请输入标签',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="组件">
              {getFieldDecorator('type', {
                initialValue: get(currData, 'type'),
                rules: [
                  {
                    required: true,
                    message: '请选择组件',
                  },
                ],
              })(
                <Select onChange={() => setDrawerKey(Math.random())}>
                  {Object.keys(formWidgetItems).map(type => {
                    const { desc } = formWidgetItems[type];
                    return (
                      <Select.Option key={type} value={type}>
                        {desc}
                      </Select.Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
            {CmpFormItems && (
              <CmpFormItems
                key={drawerKey}
                defaultValues={currData}
                key={currData && currData.type}
                form={form}
              />
            )}
            <FormItem label="前置表单">
              {getFieldDecorator('preFields', {
                initialValue: get(currData, 'preFields', []),
              })(
                <Select mode="multiple">
                  {formItems.map(({ name, label }) => {
                    return (
                      <Select.Option key={name} value={name}>
                        {label}
                      </Select.Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
            <FormItem label="必输">
              {getFieldDecorator('required', {
                valuePropName: 'checked',
                initialValue: get(currData, 'required'),
              })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
            </FormItem>
            <FormItem label="只读">
              {getFieldDecorator('disabled', {
                valuePropName: 'checked',
                initialValue: get(currData, 'disabled'),
              })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
            </FormItem>
            <FormItem label="隐藏">
              {getFieldDecorator('hidden', {
                valuePropName: 'checked',
                initialValue: get(currData, 'hidden'),
              })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
            </FormItem>
            <FormItem label="校验规则">
              {getFieldDecorator('rule.pattern', {
                initialValue: get(currData, 'rule.pattern'),
              })(
                <Select onSelect={handleRuleSelected}>
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
            {/* <FormItem label="校验规则信息">
              {getFieldDecorator('message.pattern', {
                initialValue: get(editData[optKey], 'message.pattern'),
              })(<Input />)}
            </FormItem> */}
            <FormItem label="描述">
              {getFieldDecorator('description', {
                initialValue: get(currData, 'description'),
              })(<Input />)}
            </FormItem>
          </>
        );
      },
    },
  };

  return <ProTable {...props} />;
};

export default Items;
