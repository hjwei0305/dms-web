import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { get, isEqual, cloneDeep } from 'lodash';
// import ExtFormRender from '@/components/ExtFormRender';
import ExtExportPriview from '@/components/ExtExportPriview';
import PageWrapper from '@/components/PageWrapper';
import Header from './components/Header';
// import LeftSiderbar from './components/LeftSiderbar';
import RightSiderbar from './components/RightSiderbar';

import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class ImportUiConfig extends Component {
  constructor(props) {
    super(props);
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const importUiConfigJson = get(modelUiConfig, 'exportUi');
    const importUiConfig = importUiConfigJson
      ? JSON.parse(importUiConfigJson)
      : {
          filterFormCfg: {
            formItems: [],
          },
          colItems: [],
        };
    this.state = {
      importUiConfig,
      oldImportUiConfig: cloneDeep(importUiConfig),
    };
  }

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vImportUiConfig: false,
      },
    });
  };

  handleFormItemChange = formItems => {
    const { importUiConfig = {} } = this.state;
    Object.assign(importUiConfig.filterFormCfg, { formItems });
    this.setState({
      importUiConfig,
    });
  };

  handleDelFormItem = col => {
    const { importUiConfig = {} } = this.state;
    const { formItems = [] } = importUiConfig;
    const tempFormItems = formItems.filter(item => item[0] !== col[0]);
    Object.assign(importUiConfig, { formItems: tempFormItems });
    this.setState({
      importUiConfig,
    });
  };

  handleEditFormItem = col => {
    const { importUiConfig = {} } = this.state;
    const { columns = [] } = importUiConfig;

    const tempColumns = columns.map(item => {
      if (item.dataIndex !== col.dataIndex) {
        return item;
      }
      return col;
    });
    Object.assign(importUiConfig, { columns: tempColumns });
    this.setState({
      importUiConfig,
    });
  };

  handleColItemChange = colItems => {
    const { importUiConfig = {} } = this.state;
    Object.assign(importUiConfig, { colItems });
    this.setState({
      importUiConfig,
    });
  };

  handleDelColItem = col => {
    const { importUiConfig = {} } = this.state;
    const { colItems = [] } = importUiConfig;
    const tempColItems = colItems.filter(item => item[0].code !== col[0].code);
    Object.assign(importUiConfig, { colItems: tempColItems });
    this.setState({
      importUiConfig,
    });
  };

  handleEditColItem = item => {
    const { importUiConfig = {} } = this.state;
    const { colItems = [] } = importUiConfig;
    const tempColItems = colItems.map(it => {
      if (item[0].code === it[0].code) {
        return item;
      }
      return it;
    });
    Object.assign(importUiConfig, { colItems: tempColItems });
    this.setState({
      importUiConfig,
    });
  };

  handleFilterUiCfgChange = props => {
    const { importUiConfig = {} } = this.state;
    Object.assign(importUiConfig.filterFormCfg, props);
    this.setState({
      importUiConfig,
    });
  };

  handleSave = () => {
    // const { dispatch, dataModelUiConfig } = this.props;
    // const { modelUiConfig } = dataModelUiConfig;
    const { importUiConfig } = this.state;

    this.setState({
      oldImportUiConfig: cloneDeep(importUiConfig),
    });

    // dispatch({
    //   type: 'dataModelUiConfig/saveModelUiConfig',
    //   payload: {
    //     modelUiConfig: { ...modelUiConfig, formData: JSON.stringify(importUiConfig) },
    //   },
    // });
  };

  render() {
    const { dataModelUiConfig, loading } = this.props;
    const { currPRowData } = dataModelUiConfig;
    const { importUiConfig, oldImportUiConfig } = this.state;

    return (
      <PageWrapper loading={loading.global}>
        <div className={cls(styles['visual-page-config'])}>
          <div className={cls('config-header')}>
            <Header
              hasUpdate={!isEqual(importUiConfig, oldImportUiConfig)}
              onSave={this.handleSave}
              onBack={this.handleBack}
              dataModel={currPRowData}
            />
          </div>
          {/* <div className={cls('config-left-siderbar')}>
            <LeftSiderbar
              onFormItemChange={this.handleFormItemChange}
              dataModel={currPRowData}
              onSave={this.handleSave}
              uiConfig={importUiConfig}
              onUiCfgChange={this.handleFilterUiCfgChange}
              onDelFormItem={this.handleDelFormItem}
              onEditFormItem={this.handleEditFormItem}
            />
          </div> */}
          <div className={cls('config-content')}>
            <RightSiderbar
              onItemChange={this.handleColItemChange}
              onDelItem={this.handleDelColItem}
              onEditItem={this.handleEditColItem}
              uiConfig={importUiConfig}
              dataModel={currPRowData}
            />
          </div>
          <div className={cls('config-right-siderbar')}>
            <Tabs>
              <TabPane tab="导入模版预览" key="2">
                <ExtExportPriview colItems={get(importUiConfig, 'colItems', [])} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default ImportUiConfig;
