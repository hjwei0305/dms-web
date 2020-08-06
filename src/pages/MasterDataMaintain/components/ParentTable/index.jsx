import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
// import { Tooltip } from 'antd';
import { ExtTable, ComboTree } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

// const { authAction } = utils;
const { MDMSCONTEXT } = constants;

@connect(({ masterDataMaintain, loading }) => ({ masterDataMaintain, loading }))
class CascadeTableMaster extends Component {
  state = {
    selectedNode: null,
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'masterDataMaintain/updatePageState',
      payload: {
        pVisible: true,
        isAddP: true,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataMaintain/updatePageState',
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
      type: 'masterDataMaintain/saveParent',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'masterDataMaintain/updatePageState',
          payload: {
            pVisible: false,
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
        pVisible: false,
      },
    });
  };

  getFormModalProps = () => {
    const { loading, masterDataMaintain } = this.props;
    const { pVisible, currPRowData, isAddP } = masterDataMaintain;

    return {
      save: this.save,
      rowData: isAddP ? null : currPRowData,
      visible: pVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['masterDataMaintain/saveParent'],
    };
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getComboTreeProps = () => {
    return {
      placeholder: '选择模型分类',
      style: {
        width: 200,
      },
      store: {
        url: `${MDMSCONTEXT}/dataModelType/getModelTypeTree`,
      },
      reader: {
        name: 'name',
      },
    };
  };

  handleAfterSelect = selectedNode => {
    this.setState(
      {
        selectedNode,
      },
      () => {
        this.reloadData();
      },
    );
  };

  getExtableProps = () => {
    const { dispatch } = this.props;
    const { selectedNode } = this.state;

    const columns = [
      {
        title: '表名',
        dataIndex: 'tableName',
        width: 120,
        required: true,
      },
      {
        title: '描述',
        dataIndex: 'remark',
        width: 160,
        required: true,
        // render: (text, record) => <Tooltip title={record.className}>{text}</Tooltip>
      },
      {
        title: '数据源',
        dataIndex: 'dsName',
        width: 160,
        required: true,
        // render: (text, record) => <Tooltip title={record.className}>{text}</Tooltip>
      },
      {
        title: '模型分类',
        dataIndex: 'modelTypeName',
        width: 160,
        required: true,
        // render: (text, record) => <Tooltip title={record.className}>{text}</Tooltip>
      },
    ];

    const toolBarProps = {
      left: (
        <>
          <ComboTree afterSelect={this.handleAfterSelect} {...this.getComboTreeProps()} />
        </>
      ),
    };

    let store = null;
    if (selectedNode) {
      store = {
        type: 'Get',
        url: `${MDMSCONTEXT}/dataModel/getDataModelByTypeCode?typeCode=${selectedNode.code}`,
      };
    }

    return {
      bordered: false,
      searchProperties: ['tableName', 'remark'],
      searchPlaceHolder: '输入表名或描述关键字',
      columns,
      store,
      toolBar: toolBarProps,
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'masterDataMaintain/updatePageState',
          payload: {
            currPRowData: selectedRows[0],
          },
        }).then(() => {
          dispatch({
            type: 'masterDataMaintain/getByDataModalId',
            payload: {
              modelId: selectedRows[0].id,
            },
          });
        });
      },
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default CascadeTableMaster;
