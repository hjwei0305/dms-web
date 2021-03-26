import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message } from 'antd';
import { ExtIcon } from 'suid';
import TreeView from '@/components/TreeView';
import FormModal from './FormModal';

@connect(({ masterDataRegister, loading }) => ({ masterDataRegister, loading }))
class TreePanel extends Component {
  state = {
    parentData: null,
    editData: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataRegister/queryTree',
    });
  }

  handleSelect = selectNodes => {
    if (selectNodes && selectNodes.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'masterDataRegister/updateCurrNode',
        payload: {
          currNode: selectNodes[0],
        },
      }).then(({ currNode }) => {
        dispatch({
          type: 'masterDataRegister/queryListByTypeId',
          payload: {
            categoryId: currNode.id,
          },
        });
      });
    }
  };

  handleCreateRootNode = () => {
    const { dispatch } = this.props;
    this.setState(
      {
        editData: null,
        parentData: null,
      },
      () => {
        dispatch({
          type: 'masterDataRegister/updateState',
          payload: {
            showCreateModal: true,
          },
        });
      },
    );
  };

  handleCreateChildNode = parentData => {
    const { dispatch } = this.props;
    this.setState(
      {
        parentData,
        editData: null,
      },
      () => {
        dispatch({
          type: 'masterDataRegister/updateState',
          payload: {
            showCreateModal: true,
          },
        });
      },
    );
  };

  handleEditTreeNode = editData => {
    const { dispatch } = this.props;
    this.setState(
      {
        editData,
        parentData: null,
      },
      () => {
        dispatch({
          type: 'masterDataRegister/updateState',
          payload: {
            showCreateModal: true,
          },
        });
      },
    );
  };

  handleDel = delNode => {
    const { masterDataRegister, dispatch } = this.props;
    const { currNode } = masterDataRegister;
    if (delNode) {
      dispatch({
        type: 'masterDataRegister/delTreeNode',
        payload: {
          id: delNode.id,
        },
      }).then(res => {
        if (res.success && currNode && currNode.id === delNode.id) {
          dispatch({
            type: 'masterDataRegister/updateState',
            payload: {
              currNode: null,
            },
          });
        }
        this.reloadData();
      });
    } else {
      message.warn('请选择要删除的节点！');
    }
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataRegister/updateState',
      payload: {
        showCreateModal: false,
      },
    });
  };

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataRegister/queryTree',
    });
  };

  getToolBarProps = () => ({
    left: (
      <Button onClick={this.handleCreateRootNode} type="link">
        <ExtIcon type="plus" antd />
        创建根结点
      </Button>
    ),
  });

  getModalProps = () => {
    const { parentData, editData } = this.state;
    const { masterDataRegister, loading } = this.props;
    const { showCreateModal } = masterDataRegister;

    return {
      parentData,
      editData,
      saving: loading.effects['masterDataRegister/saveTreeNode'],
      visible: showCreateModal,
      onCancel: this.handleCancel,
    };
  };

  render() {
    const { masterDataRegister } = this.props;
    const { showCreateModal, treeData } = masterDataRegister;

    return (
      <div style={{ height: '100%' }}>
        <TreeView
          toolBar={this.getToolBarProps()}
          treeData={treeData}
          onSelect={this.handleSelect}
          iconOpts={[
            {
              icon: 'plus',
              title: '新增子节点',
              onClick: this.handleCreateChildNode,
            },
            {
              icon: 'edit',
              title: '编辑',
              onClick: this.handleEditTreeNode,
            },
            {
              icon: 'delete',
              title: '删除',
              onClick: this.handleDel,
              isDel: true,
            },
          ]}
        />
        {showCreateModal ? <FormModal {...this.getModalProps()} /> : null}
      </div>
    );
  }
}

export default TreePanel;
