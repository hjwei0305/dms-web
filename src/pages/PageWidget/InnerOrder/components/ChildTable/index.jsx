import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import { utils, ExtTable } from 'suid';
import moment from 'moment';
import { constants } from '@/utils';
import PopoverIcon from '@/components/PopoverIcon';
import Space from '@/components/Space';
import FormDrawer from './FormDrawer';

const { authAction } = utils;
const { MDMSCONTEXT } = constants;

@connect(({ innerOrder, loading }) => ({ innerOrder, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { innerOrder } = this.props;
    const { currPRowData } = innerOrder;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'innerOrder/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'innerOrder/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
        isCreateChild: false,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, innerOrder } = this.props;
    const { currCRowData } = innerOrder;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'innerOrder/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'innerOrder/updatePageState',
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

  save = data => {
    const { dispatch, innerOrder } = this.props;
    const { currCRowData, isCreateChild } = innerOrder;
    let params = {};
    data.erpCreateDate = moment(data.erpCreateDate).format('YYYY-MM-DD HH:mm:ss');
    if (currCRowData && !isCreateChild) {
      Object.assign(params, currCRowData, data);
    } else {
      params = data;
    }
    dispatch({
      type: 'innerOrder/saveChild',
      payload: params,
    }).then(res => {
      if (res.success) {
        this.reloadData();
        this.closeFormModal();
      }
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'innerOrder/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['innerOrder/delCRow'] && delRowId === row.id) {
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
    const { innerOrder, loading } = this.props;
    const { currPRowData, currCRowData } = innerOrder;

    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 140,
        dataIndex: 'id',
        className: 'action',
        align: 'center',
        required: true,
        render: (_, record) => {
          return (
            <>
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
            </>
          );
        },
      },
      {
        title: '内部订单代码',
        dataIndex: 'code',
        width: 180,
      },
      {
        title: '内部订单名称',
        dataIndex: 'name',
        width: 180,
      },
      {
        title: '成本中心代码',
        dataIndex: 'costCenterCode',
        width: 180,
      },
      {
        title: '订单类型',
        dataIndex: 'orderType',
        width: 180,
      },
      {
        title: '业务范围',
        dataIndex: 'costRange',
        width: 180,
      },
      {
        title: '货币代码',
        dataIndex: 'currencyCode',
        width: 180,
      },
      {
        title: '负责人',
        dataIndex: 'keyPerson',
        width: 180,
      },
    ];
    const toolBar = {
      left: (
        <Space>
          {authAction(
            <Button key="add" type="primary" onClick={this.add} ignore="true">
              新建
            </Button>,
          )}
          <Button onClick={this.reloadData}>刷新</Button>
        </Space>
      ),
    };

    return {
      toolBar,
      columns,
      cascadeParams: {
        filters: [
          {
            fieldName: 'erpCorporationCode',
            operator: 'EQ',
            value: currPRowData.erpCode,
          },
        ],
      },
      searchProperties: ['code', 'name'],
      searchPlaceHolder: '请输入代码或者名称查询',
      store: {
        type: 'POST',
        url: `${MDMSCONTEXT}/innerOrder/findByPage`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, innerOrder } = this.props;
    const { currPRowData, currCRowData, cVisible } = innerOrder;
    return {
      onSave: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['innerOrder/saveChild'],
    };
  };

  getFormDrawerProps = () => {
    const { loading, innerOrder } = this.props;
    const { currPRowData, currCRowData, cVisible, isCreateChild } = innerOrder;
    return {
      onOk: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      isCreateChild,
      onClose: this.closeFormModal,
      confirmLoading: loading.effects['innerOrder/saveChild'],
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
