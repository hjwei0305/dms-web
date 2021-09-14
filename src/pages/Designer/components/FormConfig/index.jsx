import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { get, isEqual, cloneDeep } from 'lodash';
import { ProLayout } from 'suid';
import ExtFormRender from '@/components/ExtFormRender';
import PageWrapper from '@/components/PageWrapper';
import Header from './components/Header';
import FormEleCfg from './components/FormEleCfg';
import FormCfg from './components/FormCfg';

const { Header: ProHeader, Content, SiderBar } = ProLayout;

const { TabPane } = Tabs;

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class FormUiConfig extends Component {
  constructor(props) {
    super(props);
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const formUiConfig = get(uiObj, 'formConfig', {
      showDescIcon: true,
      formItems: [],
    });
    this.state = {
      formUiConfig,
      oldFormUiConfig: cloneDeep(formUiConfig),
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
    const { modelUiConfig, currPRowData } = dataModelUiConfig;
    const { formUiConfig } = this.state;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const data = {
      configData: JSON.stringify(Object.assign(uiObj, { formConfig: formUiConfig })),
      configType: 'UI',
      dataDefinitionId: currPRowData.id,
    };

    this.setState({
      oldFormUiConfig: cloneDeep(formUiConfig),
    });

    dispatch({
      type: 'dataModelUiConfig/saveModelUiConfig',
      payload: {
        modelUiConfig: Object.assign(modelUiConfig, { UI: data.configData }),
        data,
      },
    });
  };

  render() {
    const { dataModelUiConfig, loading } = this.props;
    const { currPRowData } = dataModelUiConfig;
    const { formUiConfig, oldFormUiConfig } = this.state;
    const canCreateRoot = get(formUiConfig, 'canCreateRoot', false);

    return (
      <PageWrapper loading={loading.global}>
        <ProLayout>
          <ProHeader style={{ paddingLeft: 0 }} gutter={[0, 2]}>
            <Header
              hasUpdate={!isEqual(formUiConfig, oldFormUiConfig)}
              onSave={this.handleSave}
              onBack={this.handleBack}
              dataModel={currPRowData}
            />
          </ProHeader>
          <ProLayout>
            <SiderBar allowCollapse width={280} gutter={[0, 4]}>
              <FormCfg
                editData={formUiConfig}
                onEditTable={this.handleEditTable}
                onSave={this.handleSave}
                dataModel={currPRowData}
              />
            </SiderBar>
            <SiderBar width={200} gutter={[0, 4]}>
              <FormEleCfg
                onFormItemChange={this.handleFormItemChange}
                dataModel={currPRowData}
                uiConfig={formUiConfig}
                onDelFormItem={this.handleDelFormItem}
                onEditFormItem={this.handleEditFormItem}
              />
            </SiderBar>
            <Content>
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
            </Content>
          </ProLayout>
        </ProLayout>
      </PageWrapper>
    );
  }
}

export default FormUiConfig;
