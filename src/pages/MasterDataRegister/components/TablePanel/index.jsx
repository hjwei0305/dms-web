import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, message, Tag } from 'antd';
import { ExtTable, ExtIcon } from 'suid';

import FormModal from './FormModal';
import styles from '../../index.less';

@connect(({ masterDataRegister, loading }) => ({ masterDataRegister, loading }))
class TablePanel extends Component {
  reloadData = () => {
    const { dispatch, masterDataRegister } = this.props;
    const { currNode } = masterDataRegister;

    if (currNode) {
      dispatch({
        type: 'masterDataRegister/queryListByTypeId',
        payload: {
          categoryId: currNode.id,
        },
      });
    }
  };

  add = () => {
    const { dispatch, masterDataRegister } = this.props;
    if (masterDataRegister.currNode) {
      dispatch({
        type: 'masterDataRegister/updateState',
        payload: {
          modalVisible: true,
          rowData: null,
        },
      });
    } else {
      message.warn('请选择左侧树形节点');
    }
  };

  editFields = (rowData, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataRegister/updateState',
      payload: {
        configModelData: rowData,
      },
    });
  };

  edit = (rowData, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataRegister/updateState',
      payload: {
        rowData,
        modalVisible: true,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataRegister/save',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'masterDataRegister/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  handleCloseModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataRegister/updateState',
      payload: {
        modalVisible: false,
        rowData: null,
      },
    });
  };

  getExtableProps = () => {
    const { loading, masterDataRegister } = this.props;
    const { list } = masterDataRegister;

    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 120,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
          <span className={cls('action-box')}>
            {/* <ExtIcon
              key="setting"
              className="setting"
              onClick={e => this.editFields(record, e)}
              type="setting"
              tooltip={{
                title: '配置模型字段',
              }}
              ignore="true"
              antd
            /> */}
            <ExtIcon
              key="edit"
              className="edit"
              onClick={e => this.edit(record, e)}
              type="edit"
              tooltip={{
                title: '编辑',
              }}
              ignore="true"
              antd
            />
          </span>
        ),
      },
      {
        title: '主数据代码',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '主数据名称',
        dataIndex: 'name',
        width: 120,
        required: true,
      },
      {
        title: '数据结构',
        dataIndex: 'dataStructureEnumRemark',
        width: 80,
        required: true,
      },
      {
        title: '主数据分类代码',
        dataIndex: 'typeCode',
        width: 120,
        required: true,
      },
      {
        title: '主数据分类名称',
        dataIndex: 'typeName',
        width: 120,
        required: true,
      },
      {
        title: '主数据描述',
        dataIndex: 'remark',
        width: 200,
        required: true,
      },
      {
        title: '冻结',
        dataIndex: 'frozen',
        width: 80,
        required: true,
        render: frozen => <Tag color={frozen ? 'red' : 'green'}>{frozen ? '已冻结' : '可用'}</Tag>,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button key="add" type="primary" onClick={this.add} ignore="true">
            新建
          </Button>
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };
    return {
      bordered: false,
      allowCancelSelect: true,
      columns,
      loading: loading.effects['masterDataRegister/queryList'],
      toolBar: toolBarProps,
      dataSource: list,
      searchProperties: ['code', 'name'],
      searchPlaceHolder: '输入代码或者名称进行搜索',
    };
  };

  getFormModalProps = () => {
    const { loading, masterDataRegister } = this.props;
    const { modalVisible, rowData, currNode } = masterDataRegister;

    return {
      onSave: this.save,
      editData: rowData,
      visible: modalVisible,
      parentData: currNode,
      onClose: this.handleCloseModal,
      saving: loading.effects['masterDataRegister/save'],
    };
  };

  render() {
    const { masterDataRegister } = this.props;
    const { modalVisible } = masterDataRegister;

    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...this.getExtableProps()} />
        {modalVisible ? <FormModal {...this.getFormModalProps()} /> : null}
      </div>
    );
  }
}

export default TablePanel;
