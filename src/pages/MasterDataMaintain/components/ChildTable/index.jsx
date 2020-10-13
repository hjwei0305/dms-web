import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm } from 'antd';
import { get, isPlainObject } from 'lodash';
import { utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import ExtTablePreview from '@/components/ExtTablePreview';
import FormModal from './FormModal';
import ImportModal from './ImportModal';
import ExportModal from './ExportModal';
import FilterDrawer from './FilterDrawer';
import styles from '../../index.less';

const { authAction } = utils;
const { MDMSCONTEXT } = constants;

@connect(({ masterDataMaintain, loading }) => ({ masterDataMaintain, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
    importVisible: false,
    exportVisible: false,
    drawerVisible: false,
    filterParams: null,
  };

  componentDidMount() {
    this.imExStatus();
  }

  imExStatus = () => {
    const { masterDataMaintain, dispatch } = this.props;
    const { currPRowData } = masterDataMaintain;
    return dispatch({
      type: 'masterDataMaintain/imExStatus',
      payload: {
        contextPath: currPRowData.code,
      },
    });
  };

  reloadData = () => {
    const { masterDataMaintain } = this.props;
    const { currPRowData } = masterDataMaintain;
    if (currPRowData && this.tableRef) {
      this.tableRef.reloadData();
    }
  };

  handleSave = rowData => {
    const { dispatch } = this.props;

    dispatch({
      type: 'masterDataMaintain/save',
      payload: rowData,
    }).then(res => {
      if (res.success) {
        this.reloadData();
      }
    });
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'masterDataMaintain/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataMaintain/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, masterDataMaintain } = this.props;
    const { currCRowData, currPRowData } = masterDataMaintain;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'masterDataMaintain/delCRow',
          payload: {
            contextPath: currPRowData.code,
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'masterDataMaintain/updatePageState',
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

  save = data => {
    const { dispatch, masterDataMaintain } = this.props;
    const { currPRowData } = masterDataMaintain;

    dispatch({
      type: 'masterDataMaintain/saveChild',
      payload: {
        contextPath: currPRowData.code,
        data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'masterDataMaintain/updatePageState',
          payload: {
            cVisible: false,
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
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['masterDataMaintain/delCRow'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <ExtIcon
        onClick={e => e.stopPropagation()}
        tooltip={{ title: '删除' }}
        className="del"
        type="delete"
        antd
      />
    );
  };

  handleImport = () => {
    this.setState({
      importVisible: true,
    });
  };

  closeImportModal = () => {
    this.setState({
      importVisible: false,
    });
  };

  handleExport = () => {
    const { masterDataMaintain, dispatch } = this.props;
    const { currPRowData } = masterDataMaintain;
    return dispatch({
      type: 'masterDataMaintain/exportData',
      payload: {
        contextPath: currPRowData.code,
        data: this.tableRef.getQueryParams(),
      },
    });
  };

  closeExportModal = () => {
    this.setState({
      exportVisible: false,
    });
  };

  toggoleDrawerVisible = () => {
    this.setState(({ drawerVisible }) => ({ drawerVisible: !drawerVisible }));
  };

  getExtableProps = () => {
    const { filterParams } = this.state;
    const { masterDataMaintain } = this.props;
    const { modelUiConfig, currPRowData } = masterDataMaintain;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const importUiConfig = JSON.parse(get(modelUiConfig, 'Import', null));
    const exportUiConfig = JSON.parse(get(modelUiConfig, 'Export', null));
    const tableUiConfig = get(uiObj, 'showConfig', null);
    const filterFormConfig = get(uiObj, 'filterFormConfig', null);
    const tableProps = tableUiConfig || {
      columns: [],
    };

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
                  <ExtIcon
                    key="edit"
                    className="edit"
                    onClick={e => this.edit(record, e)}
                    type="edit"
                    ignore="true"
                    tooltip={{ title: '编辑' }}
                    antd
                  />,
                )}
                {record.frozen ? null : (
                  <Popconfirm
                    key="delete"
                    placement="topLeft"
                    title="确定要删除吗？"
                    onCancel={e => e.stopPropagation()}
                    onConfirm={e => {
                      this.del(record);
                      e.stopPropagation();
                    }}
                  >
                    {this.renderDelBtn(record)}
                  </Popconfirm>
                )}
              </div>
            </>
          );
        },
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          {authAction(
            <Button key="add" type="primary" onClick={this.add} ignore="true">
              新建
            </Button>,
          )}

          {importUiConfig
            ? authAction(
                <Button key="add" onClick={this.handleImport} ignore="true">
                  导入
                </Button>,
              )
            : null}
          {exportUiConfig
            ? authAction(
                <Button key="add" onClick={this.handleExport} ignore="true">
                  导出
                </Button>,
              )
            : null}
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
      extra: filterFormConfig ? (
        <span className={cls('icon-container')} onClick={this.toggoleDrawerVisible}>
          <ExtIcon type="filter" theme="twoTone" antd />
        </span>
      ) : null,
    };
    tableProps.columns = columns.concat(tableProps.columns);
    tableProps.toolBar = toolBarProps;
    tableProps.showSearch = !!tableProps.searchProperties.length;
    if (isPlainObject(filterParams)) {
      const filters = [];
      Object.keys(filterParams).forEach(fieldName => {
        const value = filterParams[fieldName];
        if (value) {
          filters.push({
            fieldName,
            value: filterParams[fieldName],
            operator: 'EQ',
            fieldType: 'string',
          });
        }
      });
      tableProps.cascadeParams = {
        filters,
      };
    }

    tableProps.store = {
      type: 'POST',
      url: `${MDMSCONTEXT}/${currPRowData.code}/findByPage`,
    };
    return tableProps;
  };

  handleFilter = filterParams => {
    this.setState(
      {
        filterParams,
      },
      () => {
        this.toggoleDrawerVisible();
      },
    );
  };

  getFormModalProps = () => {
    const { loading, masterDataMaintain } = this.props;
    const { currPRowData, currCRowData, cVisible, modelUiConfig } = masterDataMaintain;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const formUiConfig = get(uiObj, 'formConfig', null);
    return {
      formUiConfig,
      onSave: this.save,
      pRowData: currPRowData,
      rowData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['masterDataMaintain/saveChild'],
    };
  };

  getFilterDrawerProps = () => {
    const { drawerVisible } = this.state;
    const { masterDataMaintain } = this.props;
    const { modelUiConfig } = masterDataMaintain;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const uiConfig = get(uiObj, 'filterFormConfig', null);
    return {
      uiConfig,
      onFilter: this.handleFilter,
      visible: drawerVisible,
      onCancel: this.toggoleDrawerVisible,
    };
  };

  handleImportTplData = () => {
    const { masterDataMaintain, dispatch } = this.props;
    const { currPRowData } = masterDataMaintain;
    return dispatch({
      type: 'masterDataMaintain/importTemplateData',
      payload: {
        contextPath: currPRowData.code,
      },
    });
  };

  handleUpload = data => {
    const { masterDataMaintain, dispatch } = this.props;
    const { currPRowData } = masterDataMaintain;
    return dispatch({
      type: 'masterDataMaintain/importDataExcel',
      payload: {
        contextPath: currPRowData.code,
        data,
      },
    });
  };

  getImportModalProps = () => {
    const { masterDataMaintain } = this.props;
    const { currPRowData, modelUiConfig } = masterDataMaintain;
    return {
      getExportData: this.handleImportTplData,
      editData: currPRowData,
      uiConfig: modelUiConfig,
      onCancel: this.closeImportModal,
      onUpload: this.handleUpload,
    };
  };

  getExportModalProps = () => {
    const { masterDataMaintain } = this.props;
    const { modelUiConfig } = masterDataMaintain;
    const exportUiConfig = JSON.parse(get(modelUiConfig, 'Export', JSON.stringify({})));

    return {
      uiConfig: exportUiConfig.filterFormCfg,
      onCancel: this.closeExportModal,
    };
  };

  render() {
    const { importVisible, exportVisible } = this.state;
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTablePreview
          onRef={inst => (this.tableRef = inst)}
          tableProps={this.getExtableProps()}
        />
        {/* <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} /> */}
        <FormModal {...this.getFormModalProps()} />
        <FilterDrawer {...this.getFilterDrawerProps()} />
        {importVisible ? <ImportModal {...this.getImportModalProps()} /> : null}
        {exportVisible ? <ExportModal {...this.getExportModalProps()} /> : null}
      </div>
    );
  }
}

export default ChildTable;
