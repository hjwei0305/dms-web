import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Tabs, Button } from 'antd';
import { get } from 'lodash';
import { constants } from '@/utils';
import ExtFormRender from '@/components/ExtFormRender';
import ExtTablePreview from '@/components/ExtTablePreview';
import ExtTreePreview from '@/components/ExtTreePreview';

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
  };

  render() {
    const { activeKey } = this.state;
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const formUiConfig = JSON.parse(get(modelUiConfig, 'formData', ''));
    const tableUiConfig = JSON.parse(get(modelUiConfig, 'tableData', ''));
    const dataStructure = get(modelUiConfig, 'dataStructure', 'LIST');

    return (
      <div
        className={cls({
          [styles['ui-config-preview']]: true,
        })}
      >
        <Tabs
          tabBarExtraContent={
            activeKey === 'tableUi' || activeKey === 'formUi' ? (
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
              <ExtFormRender uiConfig={formUiConfig} />
            ) : (
              <span className={cls('ele-center')}>
                暂无表单配置{' '}
                <Button size="large" type="link" onClick={this.handleConfigFormUI}>
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
