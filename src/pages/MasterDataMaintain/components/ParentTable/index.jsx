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
      placeholder: '选择主数据分类',
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
        title: '代码',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 160,
        required: true,
      },
      {
        title: '模型分类',
        dataIndex: 'typeName',
        width: 160,
        required: true,
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
        url: `${MDMSCONTEXT}/masterDataUiConfig/getConfigByTypeCode?typeCode=${selectedNode.code}`,
      };
    }

    return {
      bordered: false,
      searchProperties: ['code', 'name'],
      searchPlaceHolder: '输入代码或名称关键字',
      columns,
      store,
      toolBar: toolBarProps,
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'masterDataMaintain/updatePageState',
          payload: {
            currPRowData: selectedRows[0],
            modelUiConfig: selectedRows[0],
          },
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
