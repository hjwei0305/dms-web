import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { utils, ExtTable } from 'suid';
import { constants } from '@/utils';
import PopoverIcon from '@/components/PopoverIcon';
import FormPopover from './FormPopover';

import styles from '../../index.less';

const { authAction } = utils;
const { MDMSCONTEXT } = constants;

@connect(({ dataShare, loading }) => ({ dataShare, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { dataShare } = this.props;
    const { currPRowData } = dataShare;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'dataShare/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataShare/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, dataShare } = this.props;
    const { currCRowData } = dataShare;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'dataShare/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'dataShare/updatePageState',
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
      type: 'dataShare/saveChild',
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
      type: 'dataShare/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['dataShare/delCRow'] && delRowId === row.id) {
      return <PopoverIcon className="del-loading" type="loading" antd />;
    }
    return (
      <PopoverIcon
        onClick={e => e.stopPropagation()}
        tooltip={{ title: '取消订阅' }}
        className="del"
        type="undo"
        antd
      />
    );
  };

  getExtableProps = () => {
    const { dataShare, loading } = this.props;
    const { currPRowData, currCRowData } = dataShare;

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
                    isSaving={loading.effects['dataShare/saveChild']}
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
                  title="确定要取消订阅吗？"
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
        title: '订阅主数据名称',
        dataIndex: 'dataName',
        width: 180,
        render: (dataName, { frozen }) => {
          return (
            <>
              {`${dataName} `}
              {frozen ? <Tag color="red">冻结</Tag> : null}
            </>
          );
        },
      },
      {
        title: '订阅主数据代码',
        dataIndex: 'dataCode',
      },
      {
        title: '订阅者名称',
        dataIndex: 'ownerName',
      },
      {
        title: '订阅者邮箱',
        width: 180,
        dataIndex: 'ownerEmail',
      },
      {
        title: '备注',
        width: 200,
        dataIndex: 'remark',
      },
    ];
    const toolBar = {
      left: (
        <Fragment>
          {authAction(
            <FormPopover
              key="add"
              onSave={this.save}
              isSaving={loading.effects['dataShare/saveChild']}
              parentData={currPRowData}
            >
              <Button key="add" type="primary" onClick={this.add} ignore="true">
                订阅
              </Button>
            </FormPopover>,
          )}
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };

    return {
      toolBar,
      columns,
      searchProperties: ['dataCode', 'dataName'],
      searchPlaceHolder: '请输入代码或名称进行快速查询',
      store: {
        type: 'GET',
        url: `${MDMSCONTEXT}/appSubscription/getDataFromAppCode?appCode=${currPRowData.code}`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, dataShare } = this.props;
    const { currPRowData, currCRowData, cVisible } = dataShare;
    return {
      onSave: this.save,
      parentData: currPRowData,
      editData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['dataShare/saveChild'],
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
      </div>
    );
  }
}

export default ChildTable;
