import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Popconfirm, Tag } from 'antd';
import { utils, ExtTable } from 'suid';
import { constants } from '@/utils';
import PopoverIcon from '@/components/PopoverIcon';
import Space from '@/components/Space';
// import FormPopover from './FormPopover';
import FormDrawer from './FormDrawer';

const { authAction } = utils;
const { MDMSCONTEXT } = constants;

@connect(({ personnel, loading }) => ({ personnel, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { personnel } = this.props;
    const { currPRowData } = personnel;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'personnel/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnel/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, personnel } = this.props;
    const { currCRowData } = personnel;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'personnel/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'personnel/updatePageState',
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
    const { dispatch, personnel } = this.props;
    const { currCRowData } = personnel;
    let params = {};
    if (currCRowData) {
      Object.assign(params, currCRowData, data);
    } else {
      params = data;
    }
    dispatch({
      type: 'personnel/saveChild',
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
      type: 'personnel/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['personnel/delCRow'] && delRowId === row.id) {
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
    const { personnel, loading } = this.props;
    const { currPRowData, currCRowData } = personnel;

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
                  // <FormPopover
                  //   key="edit"
                  //   onSave={this.save}
                  //   editData={currCRowData}
                  //   isSaving={loading.effects['personnel/saveChild']}
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
              </div>
            </>
          );
        },
      },
      {
        title: '员工编号',
        dataIndex: 'code',
        width: 180,
      },
      {
        title: '员工姓名',
        dataIndex: 'name',
        width: 180,
      },
      {
        title: '身份证',
        dataIndex: 'idCard',
      },
      {
        title: '电子邮件',
        dataIndex: 'email',
      },
      {
        title: '生日',
        dataIndex: 'birthday',
      },
      {
        title: '	成本中心代码',
        dataIndex: 'costCenterCode',
      },
      {
        title: '性别',
        dataIndex: 'gender',
      },
      {
        title: '通信地址',
        dataIndex: 'mailingAddress',
      },
      {
        title: '移动电话',
        dataIndex: 'mobile',
      },
      {
        title: '员工组',
        width: 180,
        dataIndex: 'personnelGroup',
      },
      {
        title: '职位等级',
        width: 200,
        dataIndex: 'postGrade',
      },
      {
        title: '邮政编码',
        width: 200,
        dataIndex: 'postalCode',
      },
      {
        title: '姓名缩写',
        width: 200,
        dataIndex: 'shortName',
      },
      {
        title: '座机电话',
        width: 200,
        dataIndex: 'telephone',
      },
      {
        title: '在职状态',
        width: 200,
        dataIndex: 'workingStatus',
      },
    ];
    const toolBar = {
      left: (
        <Space>
          {authAction(
            // <FormPopover
            //   key="add"
            //   onSave={this.save}
            //   isSaving={loading.effects['personnel/saveChild']}
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

    const cascadeParams = {};
    if (currPRowData) {
      Object.assign(cascadeParams, {
        filters: [
          {
            fieldName: 'erpCorporationCode',
            operator: 'EQ',
            value: currPRowData.erpCode,
          },
        ],
      });
    }

    return {
      toolBar,
      columns,
      cascadeParams,
      searchProperties: ['code', 'name'],
      searchPlaceHolder: '请输入代码或者名称查询',
      store: {
        type: 'POST',
        url: `${MDMSCONTEXT}/personnel/findByPage`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, personnel } = this.props;
    const { currPRowData, currCRowData, cVisible } = personnel;
    return {
      onSave: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['personnel/saveChild'],
    };
  };

  getFormDrawerProps = () => {
    const { loading, personnel } = this.props;
    const { currPRowData, currCRowData, cVisible } = personnel;
    return {
      onOk: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onClose: this.closeFormModal,
      confirmLoading: loading.effects['personnel/saveChild'],
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
