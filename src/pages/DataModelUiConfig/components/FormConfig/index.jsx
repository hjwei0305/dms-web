import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { get } from 'lodash';
import ExtFormRender from '@/components/ExtFormRender';
import PageWrapper from '@/components/PageWrapper';
import Header from './components/Header';
import LeftSiderbar from './components/LeftSiderbar';
import RightSiderbar from './components/RightSiderbar';

import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class FormUiConfig extends Component {
  constructor(props) {
    super(props);
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const formDataJson = get(modelUiConfig, 'formData');
    const formUiConfig = formDataJson
      ? JSON.parse(formDataJson)
      : {
          showDescIcon: true,
          formItems: [],
        };
    this.state = {
      formUiConfig,
    };
  }

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vFormUiConfig: false,
      },
    });
  };

  handleFormItemChange = formItems => {
    const { formUiConfig = {} } = this.state;
    Object.assign(formUiConfig, { formItems });
    this.setState({
      formUiConfig,
    });
  };

  handleDelFormItem = col => {
    const { formUiConfig = {} } = this.state;
    const { formItems = [] } = formUiConfig;
    const tempFormItems = formItems.filter(item => item[0] !== col[0]);
    Object.assign(formUiConfig, { formItems: tempFormItems });
    this.setState({
      formUiConfig,
    });
  };

  handleEditFormItem = col => {
    const { formUiConfig = {} } = this.state;
    const { columns = [] } = formUiConfig;

    const tempColumns = columns.map(item => {
      if (item.dataIndex !== col.dataIndex) {
        return item;
      }
      return col;
    });
    Object.assign(formUiConfig, { columns: tempColumns });
    this.setState({
      formUiConfig,
    });
  };

  handleEditTable = props => {
    const { formUiConfig = {} } = this.state;
    Object.assign(formUiConfig, props);
    this.setState({
      formUiConfig,
    });
  };

  handleSave = () => {
    const { dispatch, dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const { formUiConfig } = this.state;

    dispatch({
      type: 'dataModelUiConfig/saveModelUiConfig',
      payload: {
        modelUiConfig: { ...modelUiConfig, formData: JSON.stringify(formUiConfig) },
      },
    });
  };

  render() {
    const { dataModelUiConfig, loading } = this.props;
    const { currPRowData } = dataModelUiConfig;
    const { formUiConfig } = this.state;
    const canCreateRoot = get(formUiConfig, 'canCreateRoot', false);

    return (
      <PageWrapper loading={loading.global}>
        <div className={cls(styles['visual-page-config'])}>
          <div className={cls('config-header')}>
            <Header onBack={this.handleBack} dataModel={currPRowData} />
          </div>
          <div className={cls('config-left-siderbar')}>
            <RightSiderbar
              editData={formUiConfig}
              onEditTable={this.handleEditTable}
              onSave={this.handleSave}
              dataModel={currPRowData}
            />
          </div>
          <div className={cls('config-content')}>
            <LeftSiderbar
              onFormItemChange={this.handleFormItemChange}
              dataModel={currPRowData}
              uiConfig={formUiConfig}
              onDelFormItem={this.handleDelFormItem}
              onEditFormItem={this.handleEditFormItem}
            />
          </div>
          <div className={cls('config-right-siderbar')}>
            <Tabs>
              <TabPane tab="创建表单预览" key="1">
                <ExtFormRender
                  uiConfig={{
                    ...formUiConfig,
                    ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[1]]) },
                  }}
                />
              </TabPane>
              <TabPane tab="编辑表单预览" key="2">
                <ExtFormRender
                  uiConfig={{
                    ...formUiConfig,
                    ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[2]]) },
                  }}
                />
              </TabPane>
              {canCreateRoot ? (
                <TabPane tab="创建根结点表单预览" key="3">
                  <ExtFormRender
                    uiConfig={{
                      ...formUiConfig,
                      ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[3]]) },
                    }}
                  />
                </TabPane>
              ) : null}
            </Tabs>
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default FormUiConfig;
