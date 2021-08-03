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

@connect(({ corpProject, loading }) => ({ corpProject, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { corpProject } = this.props;
    const { currPRowData } = corpProject;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'corpProject/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'corpProject/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, corpProject } = this.props;
    const { currCRowData } = corpProject;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'corpProject/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'corpProject/updatePageState',
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
    const { dispatch, corpProject } = this.props;
    const { currCRowData } = corpProject;
    let params = {};
    if (currCRowData) {
      Object.assign(params, currCRowData, data);
    } else {
      params = data;
    }
    dispatch({
      type: 'corpProject/saveChild',
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
      type: 'corpProject/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['corpProject/delCRow'] && delRowId === row.id) {
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
    const { corpProject } = this.props;
    const { currPRowData } = corpProject;

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
        title: '项目名称',
        dataIndex: 'name',
        width: 180,
      },
      {
        title: 'wbs项目代码',
        dataIndex: 'wbsProjectCode',
        width: 180,
        render: wbsProjectCode => wbsProjectCode || '-',
      },
      {
        title: 'wbs项目名称',
        dataIndex: 'wbsProjectName',
        width: 220,
        render: wbsProjectName => wbsProjectName || '-',
      },
      {
        title: '内部订单代码',
        dataIndex: 'innerOrderCode',
        width: 180,
        render: innerOrderCode => innerOrderCode || '-',
      },
      {
        title: '内部订单名称',
        dataIndex: 'innerOrderName',
        width: 220,
        render: innerOrderName => innerOrderName || '-',
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
      cascadeParams: {
        filters: [
          {
            fieldName: 'erpCorporationCode',
            operator: 'EQ',
            value: currPRowData.erpCode,
          },
        ],
      },
      searchProperties: ['name'],
      searchPlaceHolder: '请输入项目名称',
      store: {
        type: 'POST',
        url: `${MDMSCONTEXT}/corporationProject/findByPage`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, corpProject } = this.props;
    const { currPRowData, currCRowData, cVisible } = corpProject;
    return {
      onSave: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['corpProject/saveChild'],
    };
  };

  getFormDrawerProps = () => {
    const { loading, corpProject } = this.props;
    const { currPRowData, currCRowData, cVisible } = corpProject;
    return {
      onOk: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onClose: this.closeFormModal,
      confirmLoading: loading.effects['corpProject/saveChild'],
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
