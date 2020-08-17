import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Tabs, Button } from 'antd';
import { get } from 'lodash';
import ExtFormRender from '@/components/ExtFormRender';
import ExtTablePreview from '@/components/ExtTablePreview';

import styles from './index.less';

const { TabPane } = Tabs;

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
          <TabPane tab="列表配置预览" key="tableUi">
            {tableUiConfig ? (
              <ExtTablePreview tableUiConfig={tableUiConfig} />
            ) : (
              <span className={cls('ele-center')}>
                暂无列表配置{' '}
                <Button size="large" type="link" onClick={this.handleConfigListUI}>
                  去配置
                </Button>
              </span>
            )}
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
