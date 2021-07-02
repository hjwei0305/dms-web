import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Popconfirm, Tag } from 'antd';
import { utils, ExtTable } from 'suid';
import { constants } from '@/utils';
import PopoverIcon from '@/components/PopoverIcon';
import Space from '@/components/Space';
import FormDrawer from './FormDrawer';

const { authAction } = utils;
const { MDMSCONTEXT } = constants;

@connect(({ corpPaymentBankAccount, loading }) => ({ corpPaymentBankAccount, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { corpPaymentBankAccount } = this.props;
    const { currPRowData } = corpPaymentBankAccount;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'corpPaymentBankAccount/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'corpPaymentBankAccount/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  setAsDefault = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'corpPaymentBankAccount/setDefault',
      payload: {
        id: rowData.id,
      },
    }).then(() => {
      this.reloadData();
    });
  };

  del = record => {
    const { dispatch, corpPaymentBankAccount } = this.props;
    const { currCRowData } = corpPaymentBankAccount;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'corpPaymentBankAccount/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'corpPaymentBankAccount/updatePageState',
                payload: {
                  currCRowData: null,
                },
              }).then(() => {
                this.setState({
                  delRowId: null,
                });
              });
            } else {
              this.setState({
                delRowId: null,
              });
            }
            this.reloadData();
          }
        });
      },
    );
  };

  save = (data, cb) => {
    const { dispatch, corpPaymentBankAccount } = this.props;
    const { currCRowData } = corpPaymentBankAccount;
    let params = {};
    if (currCRowData) {
      Object.assign(params, currCRowData, data);
    } else {
      params = data;
    }
    dispatch({
      type: 'corpPaymentBankAccount/saveChild',
      payload: params,
    }).then(res => {
      if (res.success) {
        this.reloadData();
        // cb(false);
        this.closeFormModal();
      }
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'corpPaymentBankAccount/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['corpPaymentBankAccount/delCRow'] && delRowId === row.id) {
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

  getExtableProps = () => {
    const { corpPaymentBankAccount } = this.props;
    const { currPRowData } = corpPaymentBankAccount;

    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 150,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => {
          return (
            <>
              <Space onClick={e => e.stopPropagation()}>
                {authAction(
                  <PopoverIcon
                    key="edit"
                    className="edit"
                    onClick={e => this.edit(record, e)}
                    type="edit"
                    ignore="true"
                    tooltip={{ title: '编辑' }}
                    antd
                  />,
                )}
                <Popconfirm
                  key="setting"
                  placement="topLeft"
                  title="确定设置默认吗？"
                  onCancel={e => e.stopPropagation()}
                  onConfirm={e => {
                    this.setAsDefault(record);
                    e.stopPropagation();
                  }}
                >
                  <PopoverIcon type="setting" ignore="true" tooltip={{ title: '设置默认' }} antd />
                </Popconfirm>
                <Popconfirm
                  key="delete"
                  placement="topLeft"
                  title="删除后不能恢复，确定要删除吗？"
                  onCancel={e => e.stopPropagation()}
                  onConfirm={e => {
                    this.del(record);
                    e.stopPropagation();
                  }}
                >
                  {this.renderDelBtn(record)}
                </Popconfirm>
              </Space>
            </>
          );
        },
      },
      {
        title: '银行账号',
        dataIndex: 'bankAccountNumber',
        width: 180,
        render: (bankAccountNumber, { defaultTag }) => (
          <>
            {bankAccountNumber}
            {defaultTag && (
              <div>
                <Tag color="blue">默认付款帐号</Tag>
              </div>
            )}
          </>
        ),
      },
      {
        title: '银行户名',
        dataIndex: 'bankAccountName',
        width: 220,
      },
      {
        title: '关联银行行别代码',
        dataIndex: 'bankCategoryCode',
        width: 220,
      },
      {
        title: '关联银行行别名称',
        dataIndex: 'bankCategoryName',
        width: 220,
      },
      {
        title: '银行代码',
        dataIndex: 'bankCode',
      },
      {
        title: '银行名称',
        dataIndex: 'bankName',
      },
      {
        title: '货币代码',
        dataIndex: 'currencyCode',
      },
      {
        title: '货币名称',
        dataIndex: 'currencyName',
      },
      {
        title: '科目代码',
        dataIndex: 'ledgerAccountCode',
        width: 220,
      },
      {
        title: '科目名称',
        dataIndex: 'ledgerAccountName',
        width: 220,
      },
    ];
    const toolBar = {
      left: (
        <Space>
          {authAction(
            <Button key="add" type="primary" onClick={this.add} ignore="true">
              新增
            </Button>,
          )}
          <Button onClick={this.reloadData}>刷新</Button>
        </Space>
      ),
    };

    return {
      toolBar,
      columns,
      searchProperties: ['bankAccountNumber', 'bankAccountName'],
      searchPlaceHolder: '请输入银行帐号、银行户名',
      store: {
        type: 'GET',
        url: `${MDMSCONTEXT}/corpPaymentBankAccount/findByCorp?corporationCode=${currPRowData &&
          currPRowData.code}`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, corpPaymentBankAccount } = this.props;
    const { currPRowData, currCRowData, cVisible } = corpPaymentBankAccount;
    return {
      onSave: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['corpPaymentBankAccount/saveChild'],
    };
  };

  getFormDrawerProps = () => {
    const { loading, corpPaymentBankAccount } = this.props;
    const { currPRowData, currCRowData, cVisible } = corpPaymentBankAccount;
    return {
      onOk: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onClose: this.closeFormModal,
      confirmLoading: loading.effects['corpPaymentBankAccount/saveChild'],
    };
  };

  render() {
    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        <FormDrawer {...this.getFormDrawerProps()} />
      </>
    );
  }
}

export default ChildTable;
