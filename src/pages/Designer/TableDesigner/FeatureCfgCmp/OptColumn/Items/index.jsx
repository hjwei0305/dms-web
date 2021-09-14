import React from 'react';
import { get } from 'lodash';
import { Input, Select } from 'antd';
import ProTable from '@/components/ProTable';

import formWidgetItems from '@/components/WidgetItems';

import { useGlobal } from '../../../hooks';

const Items = () => {
  const [{ add }, dispatch] = useGlobal();
  const { formItems = [] } = add || {};

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
    modalForm: {
      render: (form, FormItem, currData) => {
        const { getFieldDecorator } = form;
        const cmpType = get(currData, 'type', 'Input');
        const CmpFormItems = cmpType && formWidgetItems[cmpType].PropsForm;
        return (
          <>
            <FormItem label="字段">
              {getFieldDecorator('name', {
                initialValue: get(currData, 'name'),
                rules: [
                  {
                    required: true,
                    message: '请输入字段',
                  },
                ],
              })(<Input disabled={!!currData} />)}
            </FormItem>
            <FormItem label="标签">
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
                initialValue: get(currData, 'type', 'Input'),
                rules: [
                  {
                    required: true,
                    message: '请选择组件',
                  },
                ],
              })(
                <Select>
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
              <CmpFormItems defaultValues={currData} key={currData && currData.type} form={form} />
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
          </>
        );
      },
    },
  };

  return <ProTable {...props} />;
};

export default Items;
