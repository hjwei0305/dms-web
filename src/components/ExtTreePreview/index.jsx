import React, { Component, Fragment } from 'react';
import { Button, message, Descriptions } from 'antd';
import { utils } from 'suid';
import { isPlainObject, isArray } from 'lodash';
import TreeView from '@/components/TreeView';
import ColumnLayout from '@/components/Layout/ColumnLayout';
import { constants } from '@/utils';
import FormModal from './FormModal';

const { request } = utils;
const { MDMSCONTEXT } = constants;
const { Item: DescriptionItem } = Descriptions;

class ExtTreePreview extends Component {
  state = {
    parentData: null,
    editData: null,
    selectedNode: null,
    showCreateModal: false,
    treeData: [],
    loading: {
      saving: false,
      finding: false,
      deling: false,
    },
  };

  componentDidMount() {
    this.findByTree();
  }

  updateLoadingState = newLoading => {
    const { loading } = this.state;
    this.setState({
      loading: {
        ...loading,
        ...newLoading,
      },
    });
  };

  findByTree = () => {
    const { dataModelCode } = this.props;
    const url = `${MDMSCONTEXT}/${dataModelCode}/getMultipleRoots`;
    this.updateLoadingState({
      finding: true,
    });
    request({
      method: 'GET',
      url,
    })
      .then(result => {
        const { success, message: msg, data } = result;
        if (success) {
          this.setState({
            treeData: data,
          });
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        this.updateLoadingState({
          finding: false,
        });
      });
  };

  delById = id => {
    const { dataModelCode } = this.props;
    const url = `${MDMSCONTEXT}/${dataModelCode}/delete/${id}`;
    this.updateLoadingState({
      deling: true,
    });
    request({
      method: 'DELETE',
      url,
    })
      .then(result => {
        const { success, message: msg } = result;
        if (success) {
          this.findByTree();
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        this.updateLoadingState({
          deling: false,
        });
      });
  };

  handleCreateRootNode = () => {
    this.setState({
      editData: null,
      parentData: null,
      showCreateModal: true,
    });
  };

  handleCreateChildNode = parentData => {
    this.setState({
      parentData,
      editData: null,
      showCreateModal: true,
    });
  };

  handleEditTreeNode = editData => {
    this.setState({
      editData,
      parentData: null,
      showCreateModal: true,
    });
  };

  handleDel = delNode => {
    if (delNode) {
      this.delById(delNode.id);
    } else {
      message.warn('请选择要删除的节点！');
    }
  };

  handleSave = values => {
    const { dataModelCode } = this.props;
    const url = `${MDMSCONTEXT}/${dataModelCode}/save`;
    this.updateLoadingState({
      saving: true,
    });
    request({
      url,
      method: 'POST',
      data: values,
    })
      .then(result => {
        const { success, message: msg } = result;
        if (success) {
          this.findByTree();
          message.success(msg);
          this.setState({
            showCreateModal: false,
          });
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        this.updateLoadingState({
          saving: false,
        });
      });
  };

  handleCancel = () => {
    this.setState({
      showCreateModal: false,
    });
  };

  getToolBarProps = () => ({
    left: (
      <Fragment>
        <Button onClick={this.handleCreateRootNode} type="primary">
          创建根结点
        </Button>
      </Fragment>
    ),
  });

  getModalProps = () => {
    const { formUiConfig } = this.props;
    const { parentData, editData, showCreateModal, loading } = this.state;

    return {
      parentData,
      editData,
      formUiConfig,
      saving: loading.saving,
      onSave: this.handleSave,
      visible: showCreateModal,
      onCancel: this.handleCancel,
    };
  };

  handleSelect = ([selectedNode]) => {
    this.setState({
      selectedNode,
    });
  };

  render() {
    const { showCreateModal, treeData, selectedNode } = this.state;
    const { treeUiConfig } = this.props;
    const { detailFields = [], allowCreateRoot } = treeUiConfig || {};

    return (
      <div style={{ height: '100%' }}>
        <ColumnLayout title={[null, null]}>
          <TreeView
            slot="left"
            toolBar={allowCreateRoot ? this.getToolBarProps() : null}
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
          <div slot="right" style={{ padding: '0 20px' }}>
            {selectedNode ? (
              <Descriptions column={1} title={`结点${selectedNode.name}详情`}>
                {detailFields.map(item => {
                  const { code, name } = item;
                  return (
                    <DescriptionItem key={code} label={name}>
                      {!isArray(selectedNode[code]) && !isPlainObject(selectedNode[code])
                        ? selectedNode[code]
                        : JSON.stringify(selectedNode[code])}
                    </DescriptionItem>
                  );
                })}
              </Descriptions>
            ) : (
              '选择结点查看更详细的信息'
            )}
          </div>
        </ColumnLayout>
        {showCreateModal ? <FormModal {...this.getModalProps()} /> : null}
      </div>
    );
  }
}

export default ExtTreePreview;
