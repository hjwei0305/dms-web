import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { ExtTable, message } from 'suid';
import { Button, Popconfirm } from 'antd';
import { get, isPlainObject } from 'lodash';
import ModalForm from '@/components/ModalForm';
import DrawerForm from '@/components/DrawerForm';
import Space from '@/components/Space';
import PopoverIcon from '@/components/PopoverIcon';

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
  } = props;
  const [currData, setCurrData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [delId, setDelId] = useState(null);
  const tableRef = useRef(null);

  const { prefix, suffix, left, right, layout } = toolBar || {};
  const { render } = optCol || {};
  const { width, formProps, render: renderFormItems } = modalForm || {};
  const { width: drawerWidth, drawerProps = {}, render: renderDrawerFormItems } = drawerForm || {};

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
    add
      .api({ ...(currData || {}), ...data })
      .then(result => {
        const { success, message: msg } = result || {};
        if (success) {
          message.success(msg);
          refresh();
          setVisible(false);
          setCurrData(null);
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleEdit = data => {
    setSaving(true);
    edit
      .api({ ...(currData || {}), ...data })
      .then(result => {
        const { success, message: msg } = result || {};
        if (success) {
          message.success(msg);
          refresh();
          setVisible(false);
          setCurrData(null);
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleSave = data => {
    if (currData) {
      handleEdit(data);
    } else {
      handleAdd(data);
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

  const renderDelBtn = ({ id }) => {
    if (delId === id) {
      return <PopoverIcon className="del-loading" type="loading" antd />;
    }
    return (
      <PopoverIcon
        onClick={e => e.stopPropagation()}
        tooltip={{ title: '删除' }}
        className="del"
        type="delete"
        antd
      />
    );
  };

  let proColumns = columns;

  if (isPlainObject(optCol) || edit || del) {
    proColumns = [
      {
        title: '操作',
        dataIndex: 'opt',
        align: 'center',
        ...(optCol || {}),
        render: (_, record) => (
          <>
            {isPlainObject(edit) && (
              <PopoverIcon
                type="edit"
                onClick={() => {
                  setVisible(true);
                  setCurrData(record);
                }}
                antd
              />
            )}
            {isPlainObject(del) && (
              <Popconfirm
                key="delete"
                placement="topLeft"
                title="删除后不可恢复，确定要删除吗？"
                onCancel={e => e.stopPropagation()}
                onConfirm={e => {
                  delRow(record);
                  e.stopPropagation();
                }}
              >
                {renderDelBtn(record)}
              </Popconfirm>
            )}
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
        {isPlainObject(add) && (
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            {get(add, 'title', '新建')}
          </Button>
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
  };
  const modalProps = {
    formKey: currData,
    title: currData ? '编辑' : '新建',
    visible,
    width,
    formProps,
    onOk: handleSave,
    onCancel: () => {
      setVisible(false);
      setCurrData(null);
    },
    confirmLoading: saving,
    renderFormItems: (form, FormItem) =>
      renderFormItems && renderFormItems(form, FormItem, currData),
  };

  const drawerFormProps = {
    drawerKey: currData,
    title: currData ? '编辑' : '新建',
    visible,
    width: drawerWidth,
    ...drawerProps,
    onOk: handleSave,
    onClose: () => {
      setVisible(false);
      setCurrData(null);
    },
    confirmLoading: saving,
    renderFormItems: (form, FormItem) =>
      renderDrawerFormItems && renderDrawerFormItems(form, FormItem, currData),
  };

  const tableProps = {
    toolBar: proToolBar,
    columns: proColumns,
    store,
    dataSource,
    rowClassName,
    cascadeParams,
    remotePaging,
    showSearch,
    rowKey,
    ref: tableRef,
    searchProperties,
    searchPlaceHolder,
  };

  return (
    <>
      <ExtTable {...tableProps} />
      {isPlainObject(modalForm) && <ModalForm {...modalProps} />}
      {isPlainObject(drawerForm) && <DrawerForm {...drawerFormProps} />}
    </>
  );
};

export default forwardRef(ProTable);
