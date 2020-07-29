import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Popconfirm, Button, message, Dropdown, Icon, Menu } from 'antd';
import TreeView from '@/components/TreeView';
import FormModal from './FormModal';

@connect(({ dataModelType }) => ({ dataModelType }))
class TreePanel extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelType/queryTree',
    });
  }

  handleSelect = selectNodes => {
    if (selectNodes && selectNodes.length) {
      const { dispatch } = this.props;

      dispatch({
        type: 'dataModelType/updateState',
        payload: {
          selectedTreeNode: selectNodes[0],
        },
      });
    }
  };

  handleCreate = ({ key: type }) => {
    const { dataModelType, dispatch } = this.props;

    if (dataModelType.selectedTreeNode || type === 'p') {
      dispatch({
        type: 'dataModelType/updateState',
        payload: {
          showCreateModal: true,
        },
      });
    } else {
      message.warn('请选择父亲节点！');
    }
  };

  handleDel = () => {
    const { dataModelType, dispatch } = this.props;
    const { selectedTreeNode } = dataModelType;
    if (selectedTreeNode) {
      dispatch({
        type: 'dataModelType/del',
        payload: {
          id: selectedTreeNode.id,
        },
      }).then(res => {
        if (res.success) {
          dispatch({
            type: 'dataModelType/updateState',
            payload: {
              selectedTreeNode: null,
            },
          });
          this.reloadData();
        }
      });
    } else {
      message.warn('请选择要删除的节点！');
    }
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelType/updateState',
      payload: {
        showCreateModal: false,
      },
    });
  };

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelType/queryTree',
    });
  };

  getToolBarProps = () => ({
    left: (
      <Fragment>
        <Dropdown
          overlay={
            <Menu onClick={this.handleCreate}>
              <Menu.Item key="p">创建根节点</Menu.Item>
              <Menu.Item key="c">创建子节点</Menu.Item>
            </Menu>
          }
        >
          <Button style={{ marginRight: 8 }} type="primary">
            创建 <Icon type="down" />
          </Button>
        </Dropdown>
        {/* <Button style={{ marginRight: 8 }} type="primary" onClick={() => this.handleCreate('p')}>
          创建根节点
        </Button>
        <Button style={{ marginRight: 8 }} type="primary" onClick={() => this.handleCreate('c')}>
          创建节点
        </Button> */}
        <Popconfirm
          key="delete"
          placement="topLeft"
          title="确定要删除吗，删除后不可恢复？"
          onConfirm={() => this.handleDel()}
        >
          <Button type="danger">删除</Button>
        </Popconfirm>
      </Fragment>
    ),
  });

  render() {
    const { dataModelType } = this.props;
    const { showCreateModal, treeData } = dataModelType;

    return (
      <div style={{ height: '100%' }}>
        <TreeView
          toolBar={this.getToolBarProps()}
          treeData={treeData}
          onSelect={this.handleSelect}
        />
        {showCreateModal ? (
          <FormModal visible={showCreateModal} onCancel={this.handleCancel} />
        ) : null}
      </div>
    );
  }
}

export default TreePanel;
