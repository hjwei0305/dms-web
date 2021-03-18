import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Tabs, Button, Empty } from 'antd';
import { ProLayout } from 'suid';
import { get } from 'lodash';
import { constants } from '@/utils';
// import ColumnLayout from '@/components/Layout/ColumnLayout';
// import ThreeColumnLayout from '@/components/Layout/ThreeColumnLayout';
import ExtFormRender from '@/components/ExtFormRender';
import ExtTablePreview from '@/components/ExtTablePreview';
import ExtTreePreview from '@/components/ExtTreePreview';
// import ExtExportPriview from '@/components/ExtExportPriview';

import styles from './index.less';

const { TabPane } = Tabs;
const { MDMSCONTEXT } = constants;
const { Header, Content, SiderBar } = ProLayout;

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class UiConfigPreview extends Component {
  state = {
    activeKey: 'tableUi',
  };

  handleConfigListUI = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vTableUiConfig: true,
      },
    });
  };

  handleConfigFormUI = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vFormUiConfig: true,
      },
    });
  };

  handleConfigFilterFormUI = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vFilterFormConfig: true,
      },
    });
  };

  handleConfigExportUI = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vExportUiConfig: true,
      },
    });
  };

  handleConfigImportUI = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vImportUiConfig: true,
      },
    });
  };

  handleTabChange = activeKey => {
    this.setState({
      activeKey,
    });
  };

  handleEdit = () => {
    const { activeKey } = this.state;
    if (activeKey === 'tableUi') {
      this.handleConfigListUI();
    }

    if (activeKey === 'formUi') {
      this.handleConfigFormUI();
    }

    if (activeKey === 'filterFormUi') {
      this.handleConfigFilterFormUI();
    }

    if (activeKey === 'exportUi') {
      this.handleConfigExportUI();
    }

    if (activeKey === 'importUi') {
      this.handleConfigImportUI();
    }
  };

  getFormPreview = () => {
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const formUiConfig = get(uiObj, 'formConfig', null);
    const canCreateRoot = get(formUiConfig, 'canCreateRoot', false);
    if (canCreateRoot) {
      return (
        <ProLayout>
          <ProLayout style={{ marginRight: 4 }}>
            <Header size="small" title="新建子结点表单" />
            <Content>
              <ExtFormRender
                uiConfig={{
                  ...formUiConfig,
                  ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[1]]) },
                }}
              />
            </Content>
          </ProLayout>
          <ProLayout style={{ marginRight: 4 }}>
            <Header size="small" title="编辑子结点表单" />
            <Content>
              <ExtFormRender
                uiConfig={{
                  ...formUiConfig,
                  ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[2]]) },
                }}
              />
            </Content>
          </ProLayout>
          <ProLayout>
            <Header size="small" title="创建根结点表单" />
            <Content>
              <ExtFormRender
                uiConfig={{
                  ...formUiConfig,
                  ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[3]]) },
                }}
              />
            </Content>
          </ProLayout>
        </ProLayout>
      );
    }

    return (
      <ProLayout>
        <ProLayout style={{ marginRight: 4 }}>
          <Header size="small" title="新建子结点表单" />
          <Content>
            <ExtFormRender
              uiConfig={{
                ...formUiConfig,
                ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[1]]) },
              }}
            />
          </Content>
        </ProLayout>
        <ProLayout>
          <Header size="small" title="新建子结点表单" />
          <Content>
            <ExtFormRender
              uiConfig={{
                ...formUiConfig,
                ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[2]]) },
              }}
            />
          </Content>
        </ProLayout>
      </ProLayout>
    );
  };

  // getExportPreview = () => {
  //   const { dataModelUiConfig } = this.props;
  //   const { modelUiConfig } = dataModelUiConfig;
  //   const exportUiConfig = JSON.parse(get(modelUiConfig, 'Export', JSON.stringify({})));
  //   const { colItems = [], filterFormCfg } = exportUiConfig;
  //   return (
  //     <ColumnLayout gutter={4} layout={[8, 16]} title={['过滤表单', '导出列']}>
  //       <ExtFormRender
  //         slot="left"
  //         slotClassName={cls('slot-col-wrapper')}
  //         uiConfig={filterFormCfg}
  //       />
  //       <ExtExportPriview
  //         slotClassName={cls('slot-col-wrapper')}
  //         slot="right"
  //         colItems={colItems}
  //       />
  //     </ColumnLayout>
  //   );
  // };

  render() {
    const { activeKey } = this.state;
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig, currPRowData } = dataModelUiConfig;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const formUiConfig = get(uiObj, 'formConfig', null);
    const filterFormUiConfig = get(uiObj, 'filterFormConfig', null);
    const tableUiConfig = get(uiObj, 'showConfig', null);
    // const importUiConfig = JSON.parse(get(modelUiConfig, 'Import', null));
    // const exportUiConfig = JSON.parse(get(modelUiConfig, 'Export', null));
    // const { colItems: importColItems } = importUiConfig || {};
    const dataStructure = get(currPRowData, 'dataStructure', 'GENERAL');

    return (
      <div
        className={cls({
          [styles['ui-config-preview']]: true,
        })}
      >
        <Tabs
          tabBarExtraContent={
            (activeKey === 'tableUi' && tableUiConfig) ||
            (activeKey === 'formUi' && formUiConfig) ||
            (activeKey === 'filterFormUi' && filterFormUiConfig) ? (
              // (activeKey === 'importUi' && importUiConfig) ||
              // (activeKey === 'exportUi' && exportUiConfig)
              <Button type="link" onClick={this.handleEdit}>
                去编辑
              </Button>
            ) : null
          }
          activeKey={activeKey}
          onChange={this.handleTabChange}
        >
          <TabPane tab={dataStructure === 'TREE' ? '树形配置预览' : '列表配置预览'} key="tableUi">
            {tableUiConfig && dataStructure === 'GENERAL' ? (
              <ExtTablePreview
                tableUiConfig={tableUiConfig}
                store={{
                  type: 'POST',
                  url: `${MDMSCONTEXT}/${currPRowData.code}/findByPage`,
                }}
              />
            ) : null}
            {tableUiConfig && dataStructure === 'TREE' ? (
              <ExtTreePreview
                treeUiConfig={tableUiConfig}
                dataModelCode={currPRowData.code}
                formUiConfig={formUiConfig}
              />
            ) : null}
            {!tableUiConfig ? (
              <span className={cls('ele-center')}>
                <Empty description={<span>暂无列表配置</span>}>
                  <Button type="primary" onClick={this.handleConfigListUI}>
                    去配置
                  </Button>
                </Empty>
              </span>
            ) : null}
          </TabPane>
          {dataStructure === 'GENERAL' ? (
            <TabPane tab={<span>过滤表单配置预览</span>} key="filterFormUi">
              {filterFormUiConfig ? (
                <ExtFormRender uiConfig={filterFormUiConfig} />
              ) : (
                <span className={cls('ele-center')}>
                  <Empty description={<span>暂无过滤表单配置</span>}>
                    <Button type="primary" onClick={this.handleConfigFilterFormUI}>
                      去配置
                    </Button>
                  </Empty>
                </span>
              )}
            </TabPane>
          ) : null}

          <TabPane
            tab={
              <span>
                表单配置预览
                {/* <Icon type="edit" /> */}
              </span>
            }
            key="formUi"
          >
            {formUiConfig ? (
              this.getFormPreview()
            ) : (
              <span className={cls('ele-center')}>
                <Empty description={<span>暂无表单配置</span>}>
                  <Button type="primary" onClick={this.handleConfigFormUI}>
                    去配置
                  </Button>
                </Empty>
              </span>
            )}
          </TabPane>
          {/* <TabPane tab="数据导出配置预览" key="exportUi">
            {exportUiConfig ? (
              this.getExportPreview()
            ) : (
              <span className={cls('ele-center')}>
                暂无导出配置{' '}
                <Button size="large" type="link" onClick={this.handleConfigExportUI}>
                  去配置
                </Button>
              </span>
            )}
          </TabPane>
          <TabPane tab="数据导入配置预览" key="importUi">
            {importColItems ? (
              <ExtExportPriview colItems={importColItems} />
            ) : (
              <span className={cls('ele-center')}>
                暂无导入配置{' '}
                <Button size="large" type="link" onClick={this.handleConfigImportUI}>
                  去配置
                </Button>
              </span>
            )}
          </TabPane> */}
        </Tabs>
      </div>
    );
  }
}

export default UiConfigPreview;
