import React, { useState } from 'react';
import { ProLayout, ExtIcon, utils, message } from 'suid';
import { Menu, Button } from 'antd';
import { get } from 'lodash';
import ProTable from '@/components/ProTable';
import Add from './FeatureCfgCmp/Add';
import Edit from './FeatureCfgCmp/Edit';
import Del from './FeatureCfgCmp/Del';
import Table from './FeatureCfgCmp/Table';
import ToolBar from './FeatureCfgCmp/ToolBar';
import OptColumn from './FeatureCfgCmp/OptColumn';
import EasyForm from './EasyForm';
import { useGlobal } from './hooks';

const { request } = utils;

const { SubMenu } = Menu;

const { SiderBar, Content, Header } = ProLayout;

// const formCfg = [{
//   label: '代码',
//   name: 'code',
//   defaultValue: 'test',
//   type: 'Input',
// },{
//   label: '名称',
//   name: 'name',
//   defaultValue: 'test',
//   type: 'Input',
//   preFields: ['code'],
//   submitFields: ['qq'],
// }];

// 功能清单
const featureList = {
  preview: ['预览', 'eye'],
  tableCfg: ['表格显示配置', 'table'],
  toolbar: ['表格工具栏', 'tool'], // ['add', 'quickSearch', 'prefix', 'postfix']
  // add: ['新建', 'plus'],
  // quickSearch: ['快速查询', 'search'],
  // prefix: ['前缀', 'setting'],
  // postfix: ['后缀', 'setting'],
  optColumn: ['行操作', 'tags'], //  ['edit', 'del', 'custom']
  // edit: ['编辑', 'edit'],
  // del: ['删除', 'delete'],
  // custom: ['自定义', 'custom'],
  // refresh: ['刷新', 'sync'],
};

const TableDesigner = ({ onSave }) => {
  const [uiConfig] = useGlobal();
  const {
    columns,
    add: addCfg,
    edit: editCfg,
    del: delCfg,
    filter,
    _parentData,
    ...rest
  } = uiConfig;
  console.log({ add: addCfg, columns, edit: editCfg, ...rest });
  const [featureKey, setFeatureKey] = useState('preview');
  const [loading, setLoading] = useState(false);
  const { formItems: addFormItems, method: addMethod, url: addUrl, colSpan: addColSpan } = addCfg;
  const { formItems: filterFormItems, colSpan: fliterColSpan } = filter || {};
  const {
    formItems: editFormItems,
    method: editMethod,
    url: editUrl,
    colSpan: editColSpan,
  } = editCfg;
  const { method: delMethod, url: delUrl } = delCfg;
  const props = {
    ...rest,
    columns: columns.map(it => {
      const { emptyPlaceholder } = it;
      return {
        ...it,
        render: text => {
          if (text === '' || text === null || text === undefined) {
            return emptyPlaceholder;
          }

          return text;
        },
      };
    }),
    add: {
      title: '新建',
      api: async values => {
        return request({
          method: addMethod,
          url: addUrl,
          data: addMethod === 'POST' && values,
          params: addMethod === 'GET' && values,
        });
      },
    },
    edit: {
      title: '编辑',
      api: async values => {
        return request({
          method: editMethod,
          url: editUrl,
          data: editMethod === 'POST' && values,
          params: editMethod === 'GET' && values,
        });
      },
    },
    del: {
      title: '删除',
      api: async ({ id }) => {
        return request({
          method: delMethod,
          url: `${delUrl}/${id}`,
        });
      },
    },
    modalForm: {
      render: (form, FormItem, data) => (
        <EasyForm
          colSpan={data ? editColSpan : addColSpan}
          form={form}
          FormItem={FormItem}
          fields={data ? editFormItems : addFormItems}
          initialValues={data}
        />
      ),
    },
    filterForm: filter && {
      filterCfg: filterFormItems.map(({ name, operator }) => ({ name, operator })),
      render: (form, FormItem, data) => (
        <EasyForm
          colSpan={fliterColSpan}
          form={form}
          FormItem={FormItem}
          fields={filterFormItems}
          initialValues={data}
        />
      ),
    },
  };

  const preview = () => {
    return <ProTable {...props} />;
  };

  const tableCfg = () => {
    return <Table />;
  };

  const add = () => {
    return <Add />;
  };

  const edit = () => {
    return <Edit />;
  };

  const del = () => {
    return <Del />;
  };

  const toolbar = () => {
    return <ToolBar />;
  };

  const optColumn = () => {
    return <OptColumn />;
  };

  const getCmpFun = {
    preview,
    tableCfg,
    add,
    del,
    edit,
    toolbar,
    optColumn,
  };

  const getFeatureMenu = () => {
    const hasRenders = [];

    return (
      <Menu
        selectedKeys={[featureKey]}
        mode="inline"
        onClick={({ key }) => {
          setFeatureKey(key);
        }}
      >
        {Object.keys(featureList).map(feature => {
          if (!hasRenders.includes(feature)) {
            hasRenders.push(feature);
            const [label, icon, children] = featureList[feature];
            if (!children) {
              return (
                <Menu.Item key={feature}>
                  <ExtIcon type={icon} antd />
                  <span>{label}</span>
                </Menu.Item>
              );
            }
            return (
              <SubMenu
                key={feature}
                title={
                  <span>
                    <ExtIcon type={icon} antd />
                    <span>{label}</span>
                  </span>
                }
              >
                {children.map(childFeature => {
                  if (!hasRenders.includes(childFeature)) {
                    hasRenders.push(childFeature);
                    const [childLabel] = featureList[childFeature];
                    return <Menu.Item key={childFeature}>{childLabel}</Menu.Item>;
                  }
                  return null;
                })}
              </SubMenu>
            );
          }
          return null;
        })}
      </Menu>
    );
  };

  return (
    <ProLayout>
      <Header
        title="主数据配置"
        subTible={get(_parentData, 'name')}
        extra={
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              if (onSave) {
                setLoading(true);
                onSave(uiConfig)
                  .then(result => {
                    const { success, message: msg } = result;
                    if (success) {
                      message.success(msg);
                    } else {
                      message.error(msg);
                    }
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }
            }}
          >
            保存
          </Button>
        }
      />
      <ProLayout>
        <SiderBar>{getFeatureMenu()}</SiderBar>
        <Content
          empty={{
            description: '暂无配置',
            children: <Button type="primary">配置</Button>,
          }}
        >
          {getCmpFun[featureKey] ? getCmpFun[featureKey]() : null}
        </Content>
      </ProLayout>
    </ProLayout>
  );
};

export default TableDesigner;
