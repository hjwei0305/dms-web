import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { ExtTable, message, ProLayout } from 'suid';
import { Popconfirm, Button } from 'antd';
import { cloneDeep } from 'lodash';
import ModalForm from '@/components/ModalForm';
import PopoverIcon from '@/components/PopoverIcon';
import Space from '@/components/Space';

const { StackLayout, Content, Header } = ProLayout;

const SimpleTable = (
  {
    store,
    renderFormItems,
    actions,
    columns = [],
    remotePaging = true,
    toolBar,
    modalWidth,
    formProps,
    searchProperties,
    rowKey,
    dataSource,
    searchPlaceHolder,
    getStackCfg,
    cascadeParams,
    rowClassName,
    showRefresh = true,
  },
  ref,
) => {
  const [currData, setCurrData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [stackVisible, setStackVisible] = useState(false);
  const [delId, setDelId] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const tableRef = useRef(null);
  const { prefix } = toolBar || {};
  const { add, edit, del, extra = [], extraToolbarBtns = [] } = actions || {};
  const [extraIds] = useState({});

  const refresh = () => {
    if (tableRef && tableRef.current) {
      tableRef.current.remoteDataRefresh();
    }
  };

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  const getExtraActions = item => {
    return extra.map(it => {
      const { type, confirmTxt, key, handler, icon, tooltip, disable, disableTooltip } = it;
      const disabled = disable && disable(item);
      if (type === 'showStack') {
        return (
          <PopoverIcon
            key={key}
            type={icon}
            tooltip={tooltip}
            onClick={() => {
              setCurrData(item);
              setStackVisible(true);
            }}
            antd
          />
        );
      }
      if (disabled) {
        return (
          <PopoverIcon key={key} type="stop" disabled={disabled} tooltip={disableTooltip} antd />
        );
      }
      if (confirmTxt) {
        return (
          <Popconfirm
            key={key}
            placement="topLeft"
            title={confirmTxt}
            onCancel={e => e.stopPropagation()}
            onConfirm={e => {
              // setExtraIds(s => ({
              //   ...s,
              //   [key]: item.id,
              // }));
              handler(item)
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
                  // setExtraIds(s => ({
                  //   ...s,
                  //   [key]: null,
                  // }));
                });
              e.stopPropagation();
            }}
          >
            {extraIds[key] === item.id ? (
              <PopoverIcon className="del-loading" type="loading" antd />
            ) : (
              <PopoverIcon
                disabled={disable && disable(item)}
                onClick={e => e.stopPropagation()}
                type={icon}
                tooltip={tooltip}
                antd
              />
            )}
          </Popconfirm>
        );
      }
      return (
        <PopoverIcon
          onClick={e => {
            e.stopPropagation();
            handler(item)
              .then(() => {})
              .finally(() => {
                refresh();
              });
          }}
          type={icon}
          tooltip={tooltip}
          antd
          key={key}
        />
      );
    });
  };

  const getExtraToolbarActions = () => {
    return extraToolbarBtns.map(it => {
      const { key, type, props, title } = it;
      if (type === 'showStack') {
        return (
          <Button
            key={key}
            {...props}
            onClick={() => {
              setStackVisible(true);
            }}
          />
        );
      }
      return (
        <Button key={key} {...props}>
          {title}
        </Button>
      );
    });
  };

  const handleSave = data => {
    setSaving(true);
    edit(Object.assign(cloneDeep(currData || {}), data))
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

  const delRow = ({ id }) => {
    if (del) {
      setDelId(id);
      del({ id })
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
          setDelId(undefined);
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

  let defaultCols = [
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      render: (_, item) => {
        return (
          <Space>
            {edit && (
              <PopoverIcon
                type="edit"
                onClick={() => {
                  setVisible(true);
                  setCurrData(item);
                }}
                antd
              />
            )}
            {del && (
              <Popconfirm
                key="delete"
                placement="topLeft"
                title="删除后不可恢复，确定要删除吗？"
                onCancel={e => e.stopPropagation()}
                onConfirm={e => {
                  delRow(item);
                  e.stopPropagation();
                }}
              >
                {renderDelBtn(item)}
              </Popconfirm>
            )}
            {getExtraActions(item)}
          </Space>
        );
      },
    },
  ];

  const toolBarProps = {
    layout: {
      leftSpan: 12,
      rightSpan: 12,
    },
    left: (
      <Space>
        {prefix}
        {add && (
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            新建
          </Button>
        )}
        {getExtraToolbarActions()}
        {showRefresh && <Button onClick={refresh}>刷新</Button>}
      </Space>
    ),
  };
  if (!edit && !del && (!extra || !extra.length)) {
    defaultCols = [];
  }
  Object.assign(toolBarProps, toolBar);
  const tableProps = {
    store,
    dataSource,
    rowClassName,
    cascadeParams,
    columns: defaultCols.concat(columns),
    remotePaging,
    rowKey,
    toolBar: toolBarProps,
    ref: tableRef,
    searchProperties,
    searchPlaceHolder,
  };

  const modalProps = {
    title: currData ? '编辑' : '新建',
    visible,
    width: modalWidth,
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

  const { title, subTitle, render } = getStackCfg ? getStackCfg(currData) : {};

  return (
    <>
      <ExtTable {...tableProps} />
      <ModalForm {...modalProps} />
      <StackLayout destroyOnClose visible={stackVisible} zIndex={1000}>
        <Header
          title={title}
          subTitle={subTitle}
          onBack={() => {
            setStackVisible(false);
            setCurrData(null);
          }}
        />
        <Content
          style={{
            backgroundColor: '#f0f2f5',
          }}
        >
          {(stackVisible || currData) && render && render()}
        </Content>
      </StackLayout>
    </>
  );
};

export default forwardRef(SimpleTable);
