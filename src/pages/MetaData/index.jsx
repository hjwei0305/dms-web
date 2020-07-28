import React, { Component, Fragment, } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm } from "antd";
import { ExtTable, ExtIcon } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import EditModal from "./EditModal";
import styles from "./index.less";

@withRouter
@connect(({ metaData, loading, }) => ({ metaData, loading, }))
class MetaData extends Component {
  state = {
    delId: null,
  }

  reloadData = () => {
    if(this.tableRef) {
      this.tableRef.remoteDataRefresh()
    }
  };

  handleEvent = (type, row) => {
    const { dispatch } = this.props;

    switch(type) {
      case 'add':
      case 'edit':
        dispatch({
          type: "metaData/updateState",
          payload: {
            modalVisible: true,
            editData: row,
          }
        });
        break;
      case 'del':
        this.setState({
          delId: row.id
        }, () => {
          dispatch({
            type: "metaData/del",
            payload: {
              id: row.id
            },
          }).then(res => {
            if (res.success) {
              this.setState({
                delId: null
              }, () => this.reloadData());
            }
          });
        });
        break;
      default:
        break;
    }
  }

  handleSave = data => {
    const { dispatch } = this.props;

    dispatch({
      type: "metaData/save",
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "metaData/updateState",
          payload: {
            modalVisible: false
          }
        });
        this.reloadData();
      }
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "metaData/updateState",
      payload: {
        modalVisible: false,
        editData: null
      }
    });
  };

  renderDelBtn = (row) => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects["metaData/del"] && delId === row.id) {
      return <ExtIcon className="del-loading" tooltip={{ title: '删除' }} type="loading" antd />
    }
    return <ExtIcon className="del" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: "操作",
        key: "operation",
        width: 100,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (_, record) => (
          <span className={cls("action-box")}>
            <ExtIcon
              key="edit"
              className="edit"
              onClick={() => this.handleEvent('edit', record)}
              type="edit"
              ignore="true"
              tooltip={
                { title: '编辑' }
              }
              antd
            />
            <Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗？"
              onConfirm={() => this.handleEvent('del', record)}
            >
              {
                this.renderDelBtn(record)
              }
            </Popconfirm>
          </span>
        )
      },
      {
        title: "元素代码",
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: "元素名称",
        dataIndex: "name",
        width: 220,
        required: true,
      },
      {
        title: "数据类型",
        dataIndex: "dataType",
        width: 80,
        required: true,
      },
      {
        title: "长度",
        dataIndex: "length",
        width: 80,
        required: true,
      },
      {
        title: "描述",
        dataIndex: "remark",
        width: 220,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button
            key="add"
            type="primary"
            onClick={() => { this.handleEvent('add', null); }}
            ignore='true'
          >
            新建
          </Button>
          <Button onClick={this.reloadData}>
            刷新
          </Button>
        </Fragment>
      )
    };
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      store: {
        type: 'POST',
        url: 'http://rddgit.changhong.com:7300/mock/5f1e7e322fb72cd97c23e239/dataManager/metaData/findByPage'
      },
    };
  };

  getEditModalProps = () => {
    const { loading, metaData, } = this.props;
    const { modalVisible, editData } = metaData;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects["metaData/save"]
    };
  };

  render() {
    const { metaData, } = this.props;
    const { modalVisible, } = metaData;

    return (
      <PageWrapper className={cls(styles["container-box"])} >
        <ExtTable onTableRef={ inst => this.tableRef=inst } {...this.getExtableProps()} />
        {
          modalVisible
            ? <EditModal {...this.getEditModalProps()} />
            : null
        }
      </PageWrapper>
    );
  }
}

export default MetaData;
