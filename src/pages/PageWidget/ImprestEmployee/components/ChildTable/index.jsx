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

@connect(({ imprestEmployee, loading }) => ({ imprestEmployee, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { imprestEmployee } = this.props;
    const { currPRowData } = imprestEmployee;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'imprestEmployee/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'imprestEmployee/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, imprestEmployee } = this.props;
    const { currCRowData } = imprestEmployee;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'imprestEmployee/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'imprestEmployee/updatePageState',
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
      type: 'imprestEmployee/saveChild',
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
      type: 'imprestEmployee/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['imprestEmployee/delCRow'] && delRowId === row.id) {
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
    const { imprestEmployee, loading } = this.props;
    const { currPRowData, currCRowData } = imprestEmployee;

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
                    isSaving={loading.effects['imprestEmployee/saveChild']}
                    parentData={currPRowData}
                  >
                    <PopoverIcon
                      key="edit"
                      className="edit"
                      onClick={e => this.edit(record, e)}
                      type="edit"
                      ignore="true"
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
        title: '统驭科目代码',
        dataIndex: 'accountCode',
      },
      {
        title: '支付条款代码',
        dataIndex: 'paymentTermCode',
      },
      {
        title: '允许支付',
        width: 180,
        dataIndex: 'payFrozen',
        render: payFrozen => (
          <Tag color={payFrozen ? 'red' : 'green'}>{payFrozen ? '禁止' : '允许'}</Tag>
        ),
      },
    ];
    const toolBar = {
      left: (
        <Space>
          {authAction(
            <FormPopover
              key="add"
              onSave={this.save}
              isSaving={loading.effects['imprestEmployee/saveChild']}
              parentData={currPRowData}
            >
              <Button key="add" type="primary" onClick={this.add} ignore="true">
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
        url: `${MDMSCONTEXT}/imprestEmployee/getCorporationInfo?imprestEmployeeId=${currPRowData.id}`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, imprestEmployee } = this.props;
    const { currPRowData, currCRowData, cVisible } = imprestEmployee;
    return {
      onSave: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['imprestEmployee/saveChild'],
    };
  };

  render() {
    return <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />;
  }
}

export default ChildTable;
