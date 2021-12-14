import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Popconfirm, Tag } from 'antd';
import { utils, ExtTable } from 'suid';
import { constants } from '@/utils';
import PopoverIcon from '@/components/PopoverIcon';
import Space from '@/components/Space';
import FormPopover from './FormPopover';

const { authAction } = utils;
const { MDMSCONTEXT } = constants;

@connect(({ ledgerAccount, loading }) => ({ ledgerAccount, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { ledgerAccount } = this.props;
    const { currPRowData } = ledgerAccount;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'ledgerAccount/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ledgerAccount/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, ledgerAccount } = this.props;
    const { currCRowData } = ledgerAccount;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'ledgerAccount/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'ledgerAccount/updatePageState',
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
    const { dispatch } = this.props;

    dispatch({
      type: 'ledgerAccount/saveChild',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.reloadData();
        cb(false);
      }
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ledgerAccount/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['ledgerAccount/delCRow'] && delRowId === row.id) {
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
    const { ledgerAccount, loading } = this.props;
    const { currPRowData, currCRowData } = ledgerAccount;

    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 90,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => {
          return (
            <>
              <div className="action-box" onClick={e => e.stopPropagation()}>
                {authAction(
                  <FormPopover
                    key="edit"
                    onSave={this.save}
                    editData={currCRowData}
                    isSaving={loading.effects['ledgerAccount/saveChild']}
                    parentData={currPRowData}
                    ignore="true"
                  >
                    <PopoverIcon
                      key="edit"
                      className="edit"
                      onClick={e => this.edit(record, e)}
                      type="edit"
                      tooltip={{ title: '编辑' }}
                      antd
                    />
                  </FormPopover>,
                )}
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
              </div>
            </>
          );
        },
      },
      {
        title: 'ERP公司代码',
        dataIndex: 'erpCorporationCode',
        width: 180,
        render: (erpCorporationCode, { frozen }) => {
          return (
            <>
              {`${erpCorporationCode} `}
              {frozen ? <Tag color="red">冻结</Tag> : null}
            </>
          );
        },
      },
      {
        title: '字段状态组',
        dataIndex: 'fieldGroup',
      },
      {
        title: '统驭科目标识',
        dataIndex: 'categoryCode',
      },
      {
        title: '允许无税码过账',
        width: 180,
        dataIndex: 'allowNoTax',
        render: allowNoTax => (
          <Tag color={allowNoTax ? 'green' : 'red'}>{allowNoTax ? '允许' : '禁止'}</Tag>
        ),
      },
      {
        title: '税务类型',
        width: 200,
        dataIndex: 'taxCategoryCode',
      },
    ];
    const toolBar = {
      left: (
        <Space>
          {authAction(
            <FormPopover
              key="add"
              onSave={this.save}
              ignore="true"
              isSaving={loading.effects['ledgerAccount/saveChild']}
              parentData={currPRowData}
            >
              <Button key="add" type="primary" onClick={this.add}>
                新增
              </Button>
            </FormPopover>,
          )}
          <Button onClick={this.reloadData}>刷新</Button>
        </Space>
      ),
    };

    return {
      toolBar,
      columns,
      searchProperties: ['erpCorporationCode'],
      searchPlaceHolder: '请输入erp公司代码查询',
      store: {
        type: 'GET',
        url: `${MDMSCONTEXT}/ledgerAccount/getCorporationInfo?ledgerAccountId=${currPRowData.id}`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, ledgerAccount } = this.props;
    const { currPRowData, currCRowData, cVisible } = ledgerAccount;
    return {
      onSave: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['ledgerAccount/saveChild'],
    };
  };

  render() {
    return <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />;
  }
}

export default ChildTable;
