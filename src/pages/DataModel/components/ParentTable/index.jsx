import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tooltip } from 'antd';
import { utils, ExtIcon, ExtTable, } from 'suid';
import FormModal from './FormModal';
import styles from './index.less';

const { authAction } = utils;

@connect(({ dataModel, loading }) => ({ dataModel, loading }))
class CascadeTableMaster extends Component {
  state = {
    delRowId: null,
    // selectedRowKeys: [],
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'dataModel/updatePageState',
      payload: {
        pVisible: true,
        isAddP: true,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModel/updatePageState',
      payload: {
        pVisible: true,
        isAddP: false,
        currPRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModel/saveParent',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'dataModel/updatePageState',
          payload: {
            pVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch, dataModel } = this.props;
    const { currPRowData, } = dataModel;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'dataModel/delPRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currPRowData && currPRowData.id === record.id) {
              dispatch({
                type: 'dataModel/updatePageState',
                payload: {
                  currPRowData: null,
                }
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

  closeFormModal =() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModel/updatePageState',
      payload: {
        pVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['dataModel/delPRow'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <ExtIcon
        onClick={e => e.stopPropagation()}
        tooltip={{ title: '删除' }}
        className="del"
        type="delete"
        antd
      />
    );
  };

  getFormModalProps = () => {
    const { loading, dataModel } = this.props;
    const { pVisible, currPRowData, isAddP } = dataModel;

    return {
      save: this.save,
      rowData: isAddP ? null : currPRowData,
      visible: pVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['dataModel/saveParent'],
    };
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getExtableProps = () => {
    const { dispatch, } = this.props;
    const columns = [
      {
        title: "操作",
        key: "operation",
        width: 85,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (_, record) => {
          return (
            <>
              <div className="action-box" onClick={e => e.stopPropagation()}>
                {authAction(
                  <ExtIcon
                    key="edit"
                    className="edit"
                    onClick={e => this.edit(record, e)}
                    type="edit"
                    ignore="true"
                    tooltip={
                      { title: '编辑' }
                    }
                    antd
                  />,
                )}
                {record.frozen ? null : (
                  <Popconfirm
                    key='delete'
                    placement="topLeft"
                    title="确定要删除吗？"
                    onCancel={e => e.stopPropagation()}
                    onConfirm={e => {
                      this.del(record);
                      e.stopPropagation();
                    }}
                  >
                    {this.renderDelBtn(record)}
                  </Popconfirm>
                )}
              </div>
            </>
          );
        }
      },
      {
        title: "表名",
        dataIndex: "tableName",
        width: 120,
        required: true,
      },
      {
        title: "名称",
        dataIndex: "name",
        width: 160,
        required: true,
        render: (text, record) => <Tooltip title={record.className}>{text}</Tooltip>
      },
    ];

    const toolBarProps = {
      left: (
        <>
          {authAction(
            <Button
              key="add"
              type="primary"
              onClick={this.add}
              ignore='true'
            >
              新建
            </Button>
          )}
          <Button onClick={this.reloadData}>
            刷新
          </Button>
        </>
      )
    };
    return {
      bordered: false,
      remotePaging: true,
      searchProperties: ['code', 'name'],
      columns,
      toolBar: toolBarProps,
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'dataModel/updatePageState',
          payload: {
            currPRowData: selectedRows[0],
          },
        });
      },
      store: {
        type: 'POST',
        url: `http://rddgit.changhong.com:7300/mock/5e02d29836608e42d52b1d81/template-service/simple-master/findByPage`,
      },
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default CascadeTableMaster;
