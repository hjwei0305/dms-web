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
@connect(({ fieldType, loading, }) => ({ fieldType, loading, }))
class FieldType extends Component {
  state = {
    delId: null,
  }

  reloadData = _ => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  };

  handleEvent = (type, row) => {
    const { dispatch } = this.props;

    switch(type) {
      case 'add':
      case 'edit':
        dispatch({
          type: "fieldType/updateState",
          payload: {
            modalVisible: true,
            editData: row,
          }
        });
        break;
      case 'del':
        this.setState({
          delId: row.id
        }, _ => {
          dispatch({
            type: "fieldType/del",
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
      type: "fieldType/save",
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "fieldType/updateState",
          payload: {
            modalVisible: false
          }
        });
        this.reloadData();
      }
    });
  };

  handleClose = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "fieldType/updateState",
      payload: {
        modalVisible: false,
        editData: null
      }
    });
  };

  renderDelBtn = (row) => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects["fieldType/del"] && delId === row.id) {
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
              onClick={_ => this.handleEvent('edit', record)}
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
              onConfirm={_ => this.handleEvent('del', record)}
            >
              {
                this.renderDelBtn(record)
              }
            </Popconfirm>
          </span>
        )
      },
      {
        title: "代码",
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: "名称",
        dataIndex: "name",
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
        url: 'http://rddgit.changhong.com:7300/mock/5e02d29836608e42d52b1d81/template-service/simple-master/findByPage'
      },
    };
  };

  getEditModalProps = () => {
    const { loading, fieldType, } = this.props;
    const { modalVisible, editData } = fieldType;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects["fieldType/save"]
    };
  };

  render() {
    const { fieldType, } = this.props;
    const { modalVisible, } = fieldType;

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

export default FieldType;
