import React from 'react';
import { Input, Select, Slider } from 'antd';
import { ComboList } from 'suid';
import { get } from 'lodash';
import { constants } from '@/utils';
import ProTable from '@/components/ProTable';

const { MDMSCONTEXT } = constants;

import { useGlobal } from '../../../hooks';

const ALIGN = {
  left: '居左',
  center: '居中',
  right: '居右',
};

const FORMATTER = {
  formatText: '文本',
  formatDate: '日期',
  formatBool: '布尔',
};

const SORT = {
  asc: '升序',
  desc: '降序',
};

const Columns = () => {
  const [{ columns: dataSource, _parentData }, dispatch] = useGlobal();

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
      field: ['dataIndex'],
      afterSelect: item => {
        if (item) {
          form.setFieldsValue({
            title: item.name,
          });
        }
      },
    };
  };

  const props = {
    rowKey: 'dataIndex',
    showRefresh: false,
    searchPlaceHolder: '请输入列名称',
    searchProperties: ['dataIndex', 'title'],
    columns: [
      {
        title: '列名称',
        dataIndex: 'originalName',
        width: 200,
      },
      {
        title: '列别名',
        dataIndex: 'title',
        width: 200,
      },
      {
        title: '格式化',
        dataIndex: 'formatter',
        width: 120,
        render: formatter => FORMATTER[formatter] || '-',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 80,
        render: sort => SORT[sort] || '-',
      },
      {
        title: '列宽',
        dataIndex: 'width',
        width: 80,
        align: 'right',
      },
      {
        title: '对齐方式',
        dataIndex: 'align',
        width: 80,
        render: text => ALIGN[text] || '-',
      },
    ],
    toolBar: {
      prefix: '列配置',
    },
    add: {
      api: async values => {
        dispatch({
          columns: dataSource.concat([values]),
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
          columns: dataSource.map(it => {
            if (values.dataIndex === it.dataIndex) {
              return values;
            }

            return it;
          }),
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
          columns: dataSource.filter(({ dataIndex }) => values.dataIndex !== dataIndex),
        });
        return {
          success: true,
          message: '删除成功',
          data: values,
        };
      },
    },
    dataSource,
    modalForm: {
      render: (form, FormItem, currData) => {
        return (
          <>
            <FormItem
              label="显示列代码"
              name="dataIndex"
              initialValue={get(currData, 'dataIndex')}
              rules={[
                {
                  required: true,
                  message: '请输入显示列代码',
                },
              ]}
              hidden
            >
              <Input disabled={!!currData} />
            </FormItem>
            <FormItem
              label="显示列"
              name="originalName"
              initialValue={get(currData, 'originalName')}
              rules={[
                {
                  required: true,
                  message: '请选择显示列',
                },
              ]}
            >
              <ComboList {...getComboListProps(form)} />
            </FormItem>
            <FormItem
              label="列别名"
              name="title"
              initialValue={get(currData, 'title')}
              rules={[
                {
                  required: true,
                  message: '请输入列别名',
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem label="列宽" name="width" initialValue={get(currData, 'width', 120)}>
              <Slider max={300} min={60} />
            </FormItem>
            <FormItem label="对齐方式" name="align" initialValue={get(currData, 'align', 'left')}>
              <Select>
                {Object.entries(ALIGN).map(([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
            <FormItem label="格式化" name="formatter" initialValue={get(currData, 'formatter')}>
              <Select>
                {Object.entries(FORMATTER).map(([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
            <FormItem label="排序" initialValue={get(currData, 'sort')} name="sort">
              <Select>
                {Object.entries(SORT).map(([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
            <FormItem
              label="空值占位"
              name="emptyPlaceholder"
              initialValue={get(currData, 'emptyPlaceholder', '-')}
              hidden
            >
              <Input disabled />
            </FormItem>
          </>
        );
      },
    },
  };

  return <ProTable {...props} />;
};

export default Columns;
