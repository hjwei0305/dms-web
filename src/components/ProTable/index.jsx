import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { ExtTable, message } from 'suid';
import { Button } from 'antd';
import { isPlainObject } from 'lodash';
import Space from '@/components/Space';
import EditModal from './EditModal';
import EditDrawer from './EditDrawer';
import FilterIcon from './FilterIcon';
import DeleteIcon from './DeleteIcon';
import formatters from './formatter';

const ProTable = (props, ref) => {
  const {
    columns = [],
    optCol,
    remotePaging = true,
    dataSource,
    showSearch = true,
    searchPlaceHolder,
    searchProperties,
    rowKey,
    store,
    rowClassName,
    cascadeParams,
    toolBar,
    modalForm,
    drawerForm,
    showRefresh = true,
    edit,
    add,
    del,
    filterForm,
  } = props;
  const [dynamicParams, setDynamicParams] = useState(cascadeParams || {});
  const [saving, setSaving] = useState(false);
  const [delId, setDelId] = useState(null);
  const tableRef = useRef(null);
  const sortField = {};

  const { prefix, suffix, left, right, layout } = toolBar || {};
  const { render } = optCol || {};

  const refresh = () => {
    if (tableRef && tableRef.current) {
      tableRef.current.remoteDataRefresh();
    }
  };

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  const handleAdd = data => {
    setSaving(true);
    return new Promise((resolve, reject) => {
      add
        .api({ ...data })
        .then(result => {
          const { success, message: msg } = result || {};
          if (success) {
            message.success(msg);
            refresh();
            resolve();
          } else {
            message.error(msg);
            reject();
          }
        })
        .finally(() => {
          setSaving(false);
        });
    });
  };

  const handleFilter = data => {
    setDynamicParams({
      ...dynamicParams,
      filters: data,
    });
  };

  const handleEdit = (data, orginData) => {
    setSaving(true);
    return new Promise((resolve, reject) => {
      edit
        .api({ ...(orginData || {}), ...data })
        .then(result => {
          const { success, message: msg } = result || {};
          if (success) {
            message.success(msg);
            refresh();
            resolve();
          } else {
            message.error(msg);
            reject();
          }
        })
        .finally(() => {
          setSaving(false);
        });
    });
  };

  const handleSave = async (data, orginData) => {
    if (orginData) {
      return handleEdit(data, orginData);
    } else {
      return handleAdd(data);
    }
  };

  const delRow = record => {
    if (isPlainObject(del) && del.api) {
      setDelId(record.id);
      del
        .api(record)
        .then(result => {
          const { success, message: msg } = result || {};
          if (success) {
            message.success(msg);
            refresh();
          } else {
            message.error(msg);
          }
        })
        .finally(() => {
          setDelId(null);
        });
    }
  };

  let proColumns = columns.map(it => {
    const { formatter, sort, dataIndex } = it;
    // formatObj
    // if (canSearch) {
    //   tempPlaceHolder.push(title);
    //   searchProperties.push(dataIndex);
    // }
    if (formatter) {
      Object.assign(it, {
        // render: value => formatters[formatter](value, formatObj && JSON.parse(formatObj)),
        render: value => formatters[formatter](value),
      });
    }
    if (sort) {
      sortField[dataIndex] = sort;
    }
  });

  if (isPlainObject(optCol) || edit || del) {
    proColumns = [
      {
        title: '操作',
        dataIndex: 'opt',
        align: 'center',
        ...(optCol || {}),
        render: (_, record) => (
          <>
            {isPlainObject(edit) && isPlainObject(modalForm) && (
              <EditModal
                currData={record}
                modalForm={modalForm}
                confirmLoading={saving}
                onOk={handleSave}
              />
            )}
            {isPlainObject(edit) && isPlainObject(drawerForm) && (
              <EditDrawer
                add={add}
                currData={record}
                drawerForm={drawerForm}
                confirmLoading={saving}
                onOk={handleSave}
              />
            )}
            <DeleteIcon del={del} delId={delId} delData={record} onDelete={delRow} />
            {render && render(record)}
          </>
        ),
      },
    ].concat(columns);
  }

  const proToolBar = {
    layout,
    left: (
      <Space>
        {prefix}
        {isPlainObject(add) && isPlainObject(modalForm) && (
          <EditModal add={add} modalForm={modalForm} confirmLoading={saving} onOk={handleSave} />
        )}
        {isPlainObject(add) && isPlainObject(drawerForm) && (
          <EditDrawer add={add} drawerForm={drawerForm} confirmLoading={saving} onOk={handleSave} />
        )}
        {showRefresh && <Button onClick={refresh}>刷新</Button>}
        {left}
      </Space>
    ),
    right: (
      <>
        {suffix}
        {right}
      </>
    ),
    extra: <FilterIcon filterForm={filterForm} onOk={handleFilter} />,
  };

  const tableProps = {
    toolBar: proToolBar,
    columns: proColumns,
    store,
    dataSource,
    rowClassName,
    cascadeParams: dynamicParams,
    remotePaging,
    showSearch,
    rowKey,
    sort: {
      multiple: true,
      field: sortField,
    },
    ref: tableRef,
    searchProperties,
    searchPlaceHolder,
  };

  return (
    <>
      <ExtTable {...tableProps} />
    </>
  );
};

export default forwardRef(ProTable);
