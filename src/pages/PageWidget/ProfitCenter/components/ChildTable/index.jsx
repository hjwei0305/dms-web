import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Popconfirm, Badge } from 'antd';
import { utils, ExtTable } from 'suid';
import moment from 'moment';
import { constants } from '@/utils';
import PopoverIcon from '@/components/PopoverIcon';
import Space from '@/components/Space';
import FormDrawer from './FormDrawer';

const { authAction } = utils;
const { MDMSCONTEXT } = constants;

@connect(({ profitCenter, loading }) => ({ profitCenter, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { profitCenter } = this.props;
    const { currPRowData } = profitCenter;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'profitCenter/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'profitCenter/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
        isCreateChild: false,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, profitCenter } = this.props;
    const { currCRowData } = profitCenter;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'profitCenter/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'profitCenter/updatePageState',
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
    const { dispatch, profitCenter } = this.props;
    const { currCRowData, isCreateChild } = profitCenter;
    let params = {};
    data.erpCreateDate = moment(data.erpCreateDate).format('YYYY-MM-DD HH:mm:ss');
    if (currCRowData && !isCreateChild) {
      Object.assign(params, currCRowData, data);
    } else {
      params = data;
    }
    dispatch({
      type: 'profitCenter/saveChild',
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
      type: 'profitCenter/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['profitCenter/delCRow'] && delRowId === row.id) {
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
    const { profitCenter, loading } = this.props;
    const { currPRowData, currCRowData } = profitCenter;

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
        title: '利润中心代码',
        dataIndex: 'code',
        width: 180,
      },
      {
        title: '利润中心名称',
        dataIndex: 'name',
        width: 180,
      },
      {
        title: '利润中心组',
        dataIndex: 'profitGroup',
        width: 180,
      },
      {
        title: '负责人',
        dataIndex: 'keyPerson',
        width: 180,
      },
      {
        title: '冻结',
        dataIndex: 'frozen',
        width: 60,
        render: frozen => <Badge color={frozen ? 'red' : 'green'} text={frozen ? '是' : '否'} />,
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
        url: `${MDMSCONTEXT}/profitCenter/findByPage`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, profitCenter } = this.props;
    const { currPRowData, currCRowData, cVisible } = profitCenter;
    return {
      onSave: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['profitCenter/saveChild'],
    };
  };

  getFormDrawerProps = () => {
    const { loading, profitCenter } = this.props;
    const { currPRowData, currCRowData, cVisible, isCreateChild } = profitCenter;
    return {
      onOk: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      isCreateChild,
      onClose: this.closeFormModal,
      confirmLoading: loading.effects['profitCenter/saveChild'],
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
