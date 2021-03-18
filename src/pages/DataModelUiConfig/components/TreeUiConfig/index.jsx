import React, { Component } from 'react';
import { connect } from 'dva';
import { get, cloneDeep, isEqual } from 'lodash';
import { ProLayout } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import ExtTreePreview from '@/components/ExtTreePreview';
import Header from './components/Header';
import TreeDetailFieldCfg from './components/TreeDetailFieldCfg';
import TreeCfg from './components/TreeCfg';

const { Header: ProHeader, Content, SiderBar } = ProLayout;

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class TreeUiConfig extends Component {
  constructor(props) {
    super(props);
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const treeUiConfig = get(uiObj, 'showConfig', {
      showSearchTooltip: true,
      allowCreateRoot: true,
      detailFields: [],
    });
    this.state = {
      treeUiConfig,
      oldTreeUiConfig: cloneDeep(treeUiConfig),
    };
  }

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vTableUiConfig: false,
      },
    });
  };

  handleFieldChange = detailFields => {
    const { treeUiConfig = {} } = this.state;
    Object.assign(treeUiConfig, { detailFields });
    this.setState({
      treeUiConfig,
    });
  };

  handleDelField = field => {
    const { treeUiConfig = {} } = this.state;
    const { detailFields = [] } = treeUiConfig;
    const tempDetailFields = detailFields.filter(item => item.code !== field.code);
    Object.assign(treeUiConfig, { detailFields: tempDetailFields });
    this.setState({
      treeUiConfig,
    });
  };

  handleEditField = field => {
    const { treeUiConfig = {} } = this.state;
    const { detailFields = [] } = treeUiConfig;

    const tempDetailFields = detailFields.map(item => {
      if (item.dataIndex !== field.dataIndex) {
        return item;
      }
      return field;
    });
    Object.assign(treeUiConfig, { detailFields: tempDetailFields });
    this.setState({
      treeUiConfig,
    });
  };

  handleEditTable = props => {
    const { treeUiConfig = {} } = this.state;

    Object.assign(treeUiConfig, props);
    this.setState({
      treeUiConfig,
    });
  };

  handleSave = () => {
    const { dispatch, dataModelUiConfig } = this.props;
    const { modelUiConfig, currPRowData } = dataModelUiConfig;
    const { treeUiConfig = {} } = this.state;

    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const data = {
      configData: JSON.stringify(Object.assign(uiObj, { showConfig: treeUiConfig })),
      configType: 'UI',
      dataDefinitionId: currPRowData.id,
    };

    this.setState({
      oldTreeUiConfig: cloneDeep(treeUiConfig),
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
    const { treeUiConfig, oldTreeUiConfig } = this.state;

    return (
      <PageWrapper loading={loading.global}>
        <ProLayout>
          <ProHeader style={{ paddingLeft: 0 }} gutter={[0, 4]}>
            <Header
              hasUpdate={!isEqual(treeUiConfig, oldTreeUiConfig)}
              onSave={this.handleSave}
              onBack={this.handleBack}
              dataModel={currPRowData}
            />
          </ProHeader>
          <ProLayout>
            <SiderBar gutter={[0, 4]} width={250} allowCollapse>
              <TreeCfg
                editData={treeUiConfig}
                onEditTable={this.handleEditTable}
                onSave={this.handleSave}
              />
            </SiderBar>
            <SiderBar gutter={[0, 4]} width={200}>
              <TreeDetailFieldCfg
                onFieldChange={this.handleFieldChange}
                dataModel={currPRowData}
                treeUiConfig={treeUiConfig}
                onDelField={this.handleDelField}
                onEditField={this.handleEditField}
              />
            </SiderBar>
            <Content>
              <ExtTreePreview treeUiConfig={treeUiConfig} dataModelCode={currPRowData.code} />
            </Content>
          </ProLayout>
        </ProLayout>
      </PageWrapper>
    );
  }
}

export default TreeUiConfig;
