import React, { Component } from 'react';
import { utils, ExtTable } from 'suid';
import { cloneDeep, get } from 'lodash';
import { Popconfirm, Button, Input, message } from 'antd';
import cls from 'classnames';
import { constants } from '@/utils';
import Space from '@/components/Space';
import FormModal from './FormModal';
import PopoverIcon from '../PopoverIcon';

import styles from './index.less';

const { request } = utils;
const { MDMSCONTEXT } = constants;

class ExtTreeTablePreview extends Component {
  state = {
    dataSource: [],
    searchValue: '',
    action: '',
    parentData: null,
    editData: null,
    loading: {
      finding: false,
      saving: false,
      deling: false,
    },
  };

  componentDidMount() {
    this.reloadData();
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

  reloadData = () => {
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
            dataSource: data,
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

  // 查找关键字节点
  findNode = (value, tree) => {
    if (!value) {
      return tree;
    }
    return tree
      .map(node => {
        const treeNode = cloneDeep(node);
        const isInclude = treeNode.name.includes(value);
        // 如果有子节点
        if (treeNode.children && treeNode.children.length > 0) {
          treeNode.children = this.findNode(value, treeNode.children);
          // 如果标题匹配
          if (isInclude) {
            return treeNode;
          }
          // 如果标题不匹配，则查看子节点是否有匹配标题
          treeNode.children = this.findNode(value, treeNode.children);
          if (treeNode.children && treeNode.children.length > 0) {
            return treeNode;
          }
          return null;
        }
        // 没子节点
        if (isInclude) {
          return treeNode;
        }
        return null;
      })
      .filter(treeNode => treeNode);
  };

  renderDelBtn = () => {
    // const { loading } = this.props;
    // const { delRowId } = this.state;
    // if (loading.effects['masterDataMaintain/delCRow'] && delRowId === row.id) {
    //   return <ExtIcon className="del-loading" type="loading" antd />;
    // }
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
          message.success(msg);
          this.setState(
            {
              action: '',
            },
            this.reloadData,
          );
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

  getModalProps = () => {
    const { formUiConfig } = this.props;
    const { parentData, editData, loading, action } = this.state;
    // 默认创建子节点
    let uiIndex = 1;
    // 编辑子节点
    if (editData) {
      uiIndex = 2;
    }
    // 创建根结点
    if (!parentData && !editData) {
      uiIndex = 3;
    }

    return {
      parentData,
      editData,
      formUiConfig: {
        ...formUiConfig,
        ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[uiIndex]]) },
      },
      saving: loading.saving,
      onSave: this.handleSave,
      visible: !!action,
      onCancel: this.handleCancel,
    };
  };

  handleCreateRootNode = () => {
    this.setState({
      editData: null,
      parentData: null,
      action: 'createRoot',
    });
  };

  handleCreateChildNode = parentData => {
    this.setState({
      parentData,
      editData: null,
      action: 'createChild',
    });
  };

  handleEditTreeNode = editData => {
    this.setState({
      editData,
      parentData: null,
      action: 'editChild',
    });
  };

  handleCancel = () => {
    this.setState({
      action: '',
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
          this.reloadData();
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

  handleDel = delNode => {
    if (delNode) {
      this.delById(delNode.id);
    } else {
      message.warn('请选择要删除的节点！');
    }
  };

  getExtTableProps = () => {
    const { dataSource, searchValue, loading } = this.state;
    const { treeUiConfig, formUiConfig } = this.props;

    const { columns = [] } = cloneDeep(treeUiConfig) || {};
    const canCreateRoot = get(formUiConfig, 'canCreateRoot', false);

    columns.forEach(item => {
      const { dataIndex } = item;
      if (dataIndex === 'name') {
        Object.assign(item, {
          className: cls(styles['tree-col']),
        });
      }
    });

    if (formUiConfig) {
      columns.unshift({
        title: '操作',
        dataIndex: 'opttt',
        align: 'center',
        render: (_, record) => {
          return (
            <>
              <PopoverIcon
                key="plus"
                className="edit"
                onClick={() => this.handleCreateChildNode(record)}
                type="plus"
                ignore="true"
                tooltip={{ title: '新增子节点' }}
                antd
              />
              <PopoverIcon
                key="edit"
                className="edit"
                onClick={() => this.handleEditTreeNode(record)}
                type="edit"
                ignore="true"
                tooltip={{ title: '编辑' }}
                antd
              />
              <Popconfirm
                key="delete"
                placement="topLeft"
                title="确定要删除吗？"
                onCancel={e => e.stopPropagation()}
                onConfirm={e => {
                  this.handleDel(record);
                  e.stopPropagation();
                }}
              >
                {this.renderDelBtn(record)}
              </Popconfirm>
            </>
          );
        },
      });
    }
    const toolBar = {
      left: (
        <Space>
          {canCreateRoot ? (
            <Button type="primary" onClick={this.handleCreateRootNode} ignore="true">
              新建根节点
            </Button>
          ) : null}
          <Button onClick={this.reloadData}>刷新</Button>
        </Space>
      ),
      extra: (
        <Space>
          <Input.Search
            allowClear
            placeholder="请输入名称搜索"
            onSearch={searchValue => {
              this.setState({
                searchValue,
              });
            }}
          />
        </Space>
      ),
      // filterFormConfig ? (
      //   <PopoverIcon type="filter" theme="twoTone" antd onClick={this.toggoleDrawerVisible} />
      // ) : null,
    };
    return {
      toolBar,
      columns,
      dataSource: this.findNode(searchValue, dataSource),
      lineNumber: false,
      defaultExpandAllRows: true,
      pagination: false,
      indentSize: 12,
      expandIconColumnIndex: formUiConfig ? 1 : 0,
      allowCustomColumns: false,
      showSearch: false,
      loading: loading.finding,
    };
  };

  render() {
    const { formUiConfig } = this.props;
    return (
      <>
        <ExtTable {...this.getExtTableProps()} />
        {formUiConfig ? <FormModal {...this.getModalProps()} /> : null}
      </>
    );
  }
}

export default ExtTreeTablePreview;
