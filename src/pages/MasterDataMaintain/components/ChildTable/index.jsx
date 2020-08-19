import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm } from 'antd';
import { utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import ExtTablePreview from '@/components/ExtTablePreview';
import FormModal from './FormModal';
import styles from '../../index.less';

const { authAction } = utils;
const { MDMSCONTEXT } = constants;

@connect(({ masterDataMaintain, loading }) => ({ masterDataMaintain, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { masterDataMaintain } = this.props;
    const { currPRowData } = masterDataMaintain;
    if (currPRowData && this.tableRef) {
      // this.tableRef.remoteDataRefresh();
      this.tableRef.reloadData();
    }
  };

  handleSave = rowData => {
    const { dispatch } = this.props;

    dispatch({
      type: 'masterDataMaintain/save',
      payload: rowData,
    }).then(res => {
      if (res.success) {
        this.reloadData();
      }
    });
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'masterDataMaintain/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataMaintain/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, masterDataMaintain } = this.props;
    const { currCRowData, currPRowData } = masterDataMaintain;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'masterDataMaintain/delCRow',
          payload: {
            contextPath: currPRowData.code,
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'masterDataMaintain/updatePageState',
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
    const { dispatch, masterDataMaintain } = this.props;
    const { currPRowData } = masterDataMaintain;

    dispatch({
      type: 'masterDataMaintain/saveChild',
      payload: {
        contextPath: currPRowData.code,
        data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'masterDataMaintain/updatePageState',
          payload: {
            cVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataMaintain/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['masterDataMaintain/delCRow'] && delRowId === row.id) {
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

  getExtableProps = () => {
    const { masterDataMaintain } = this.props;
    const { modelUiConfig, currPRowData } = masterDataMaintain;
    const tableProps = modelUiConfig.tableData
      ? JSON.parse(modelUiConfig.tableData)
      : {
          columns: [],
        };

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
                  <ExtIcon
                    key="edit"
                    className="edit"
                    onClick={e => this.edit(record, e)}
                    type="edit"
                    ignore="true"
                    tooltip={{ title: '编辑' }}
                    antd
                  />,
                )}
                {record.frozen ? null : (
                  <Popconfirm
                    key="delete"
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
        },
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          {authAction(
            <Button key="add" type="primary" onClick={this.add} ignore="true">
              新建
            </Button>,
          )}
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };
    tableProps.columns = columns.concat(tableProps.columns);
    tableProps.toolBar = toolBarProps;
    tableProps.store = {
      type: 'POST',
      url: `${MDMSCONTEXT}/${currPRowData.code}/findByPage`,
    };
    return tableProps;
  };

  getFormModalProps = () => {
    const { loading, masterDataMaintain } = this.props;
    const { currPRowData, currCRowData, cVisible, modelUiConfig } = masterDataMaintain;
    return {
      onSave: this.save,
      pRowData: currPRowData,
      rowData: currCRowData,
      visible: cVisible,
      formUiConfig: JSON.parse(modelUiConfig.formData),
      onCancel: this.closeFormModal,
      saving: loading.effects['masterDataMaintain/saveChild'],
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTablePreview
          onRef={inst => (this.tableRef = inst)}
          tableProps={this.getExtableProps()}
        />
        {/* <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} /> */}
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default ChildTable;
