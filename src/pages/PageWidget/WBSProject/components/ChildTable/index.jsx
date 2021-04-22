import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import { utils, ExtTable } from 'suid';
import moment from 'moment';
import { constants } from '@/utils';
import PopoverIcon from '@/components/PopoverIcon';
import Space from '@/components/Space';
import FormPopover from './FormPopover';
import FormDrawer from './FormDrawer';

const { authAction } = utils;
const { MDMSCONTEXT } = constants;

@connect(({ wbsProject, loading }) => ({ wbsProject, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { wbsProject } = this.props;
    const { currPRowData } = wbsProject;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'wbsProject/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wbsProject/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, wbsProject } = this.props;
    const { currCRowData } = wbsProject;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'wbsProject/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'wbsProject/updatePageState',
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
    const { dispatch, wbsProject } = this.props;
    const { currCRowData } = wbsProject;
    let params = {};
    data.erpCreateDate = moment(data.erpCreateDate).format('YYYY-MM-DD HH:mm:ss');
    if (currCRowData) {
      Object.assign(params, currCRowData, data);
    } else {
      params = data;
    }
    dispatch({
      type: 'wbsProject/saveChild',
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
      type: 'wbsProject/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['wbsProject/delCRow'] && delRowId === row.id) {
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
    const { wbsProject, loading } = this.props;
    const { currPRowData, currCRowData } = wbsProject;

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
              <Space onClick={e => e.stopPropagation()}>
                {authAction(
                  // <FormPopover
                  //   key="edit"
                  //   onSave={this.save}
                  //   editData={currCRowData}
                  //   isSaving={loading.effects['wbsProject/saveChild']}
                  //   parentData={currPRowData}
                  // >
                  <PopoverIcon
                    key="edit"
                    className="edit"
                    onClick={e => this.edit(record, e)}
                    type="edit"
                    ignore="true"
                    tooltip={{ title: '编辑' }}
                    antd
                  />,
                  // </FormPopover>,
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
              </Space>
            </>
          );
        },
      },
      {
        title: 'WBS名称',
        dataIndex: 'name',
        width: 180,
      },
      {
        title: 'WBS编号',
        dataIndex: 'code',
        width: 180,
      },
      {
        title: 'ERP公司代码',
        dataIndex: 'erpCorporationCode',
        width: 180,
      },
      {
        title: '成本中心代码',
        dataIndex: 'costCenterCode',
        width: 180,
      },
      {
        title: '项目类型',
        dataIndex: 'projectType',
        width: 180,
      },
      {
        title: '业务范围代码',
        dataIndex: 'rangeCode',
        width: 180,
      },
      {
        title: '创建日期',
        dataIndex: 'ERP创建日期',
        width: 180,
      },
      {
        title: '总账科目代码',
        dataIndex: 'ledgerAccountCode',
        width: 180,
      },
      {
        title: '总账科目名称',
        dataIndex: 'ledgerAccountName',
        width: 180,
      },
    ];
    const toolBar = {
      left: (
        <Space>
          {authAction(
            // <FormPopover
            //   key="add"
            //   onSave={this.save}
            //   isSaving={loading.effects['wbsProject/saveChild']}
            //   parentData={currPRowData}
            // >
            <Button key="add" type="primary" onClick={this.add} ignore="true">
              新增
            </Button>,
            // </FormPopover>,
          )}
          <Button onClick={this.reloadData}>刷新</Button>
        </Space>
      ),
    };

    return {
      toolBar,
      columns,
      searchProperties: ['code', 'name'],
      searchPlaceHolder: '请输入代码或者名称查询',
      remotePaging: false,
      store: {
        type: 'GET',
        url: `${MDMSCONTEXT}/wbsProject/getAllTree?erpCorporationCode=${currPRowData.erpCode}`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, wbsProject } = this.props;
    const { currPRowData, currCRowData, cVisible } = wbsProject;
    return {
      onSave: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['wbsProject/saveChild'],
    };
  };

  getFormDrawerProps = () => {
    const { loading, wbsProject } = this.props;
    const { currPRowData, currCRowData, cVisible } = wbsProject;
    return {
      onOk: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onClose: this.closeFormModal,
      confirmLoading: loading.effects['wbsProject/saveChild'],
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
