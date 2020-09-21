import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Tabs, Button } from 'antd';
import { get } from 'lodash';
import { constants } from '@/utils';
import ColumnLayout from '@/components/Layout/ColumnLayout';
import ThreeColumnLayout from '@/components/Layout/ThreeColumnLayout';
import ExtFormRender from '@/components/ExtFormRender';
import ExtTablePreview from '@/components/ExtTablePreview';
import ExtTreePreview from '@/components/ExtTreePreview';
import ExtExportPriview from '@/components/ExtExportPriview';

import styles from './index.less';

const { TabPane } = Tabs;
const { MDMSCONTEXT } = constants;

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
    const formUiConfig = JSON.parse(get(modelUiConfig, 'formData', ''));
    const canCreateRoot = get(formUiConfig, 'canCreateRoot', false);
    if (canCreateRoot) {
      return (
        <ThreeColumnLayout
          gutter={4}
          title={['新建子结点表单', '编辑子结点表单', '创建根结点表单']}
        >
          <ExtFormRender
            slot="left"
            slotClassName={cls('slot-col-wrapper')}
            uiConfig={{
              ...formUiConfig,
              ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[1]]) },
            }}
          />
          <ExtFormRender
            slotClassName={cls('slot-col-wrapper')}
            slot="center"
            uiConfig={{
              ...formUiConfig,
              ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[2]]) },
            }}
          />
          <ExtFormRender
            slot="right"
            slotClassName={cls('slot-col-wrapper')}
            uiConfig={{
              ...formUiConfig,
              ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[3]]) },
            }}
          />
        </ThreeColumnLayout>
      );
    }

    return (
      <ColumnLayout gutter={4} layout={[12, 12]} title={['新建表单', '编辑表单']}>
        <ExtFormRender
          slot="left"
          slotClassName={cls('slot-col-wrapper')}
          uiConfig={{
            ...formUiConfig,
            ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[1]]) },
          }}
        />
        <ExtFormRender
          slot="right"
          slotClassName={cls('slot-col-wrapper')}
          uiConfig={{
            ...formUiConfig,
            ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[2]]) },
          }}
        />
      </ColumnLayout>
    );
  };

  getExportPreview = () => {
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const { exportUiConfig = {} } = JSON.parse(
      get(modelUiConfig, 'impExpData', JSON.stringify({})),
    );
    const { colItems = [], filterFormCfg } = exportUiConfig;
    return (
      <ColumnLayout gutter={4} layout={[8, 16]} title={['过滤表单', '导出列']}>
        <ExtFormRender
          slot="left"
          slotClassName={cls('slot-col-wrapper')}
          uiConfig={filterFormCfg}
        />
        <ExtExportPriview
          slotClassName={cls('slot-col-wrapper')}
          slot="right"
          colItems={colItems}
        />
      </ColumnLayout>
    );
  };

  render() {
    const { activeKey } = this.state;
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const formUiConfig = JSON.parse(get(modelUiConfig, 'formData', null));
    const tableUiConfig = JSON.parse(get(modelUiConfig, 'tableData', null));
    const { importUiConfig, exportUiConfig } = JSON.parse(
      get(modelUiConfig, 'impExpData', JSON.stringify({})),
    );
    const { colItems: importColItems } = importUiConfig || {};
    const dataStructure = get(modelUiConfig, 'dataStructure', 'LIST');

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
            (activeKey === 'importUi' && importUiConfig) ||
            (activeKey === 'exportUi' && exportUiConfig) ? (
              <Button type="link" onClick={this.handleEdit}>
                去编辑
              </Button>
            ) : null
          }
          activeKey={activeKey}
          onChange={this.handleTabChange}
        >
          <TabPane tab={dataStructure === 'TREE' ? '树形配置预览' : '列表配置预览'} key="tableUi">
            {tableUiConfig && dataStructure === 'LIST' ? (
              <ExtTablePreview
                tableUiConfig={tableUiConfig}
                store={{
                  type: 'POST',
                  url: `${MDMSCONTEXT}/${modelUiConfig.code}/findByPage`,
                }}
              />
            ) : null}
            {tableUiConfig && dataStructure === 'TREE' ? (
              <ExtTreePreview
                treeUiConfig={tableUiConfig}
                dataModelCode={modelUiConfig.code}
                formUiConfig={formUiConfig}
              />
            ) : null}
            {!tableUiConfig ? (
              <span className={cls('ele-center')}>
                暂无列表配置{' '}
                <Button size="large" type="link" onClick={this.handleConfigListUI}>
                  去配置
                </Button>
              </span>
            ) : null}
          </TabPane>
          <TabPane tab="表单配置预览" key="formUi">
            {formUiConfig ? (
              this.getFormPreview()
            ) : (
              <span className={cls('ele-center')}>
                暂无表单配置{' '}
                <Button size="large" type="link" onClick={this.handleConfigFormUI}>
                  去配置
                </Button>
              </span>
            )}
          </TabPane>
          <TabPane tab="数据导出配置预览" key="exportUi">
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
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default UiConfigPreview;
