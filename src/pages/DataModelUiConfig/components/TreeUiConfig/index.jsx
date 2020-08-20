import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { get } from 'lodash';
import PageWrapper from '@/components/PageWrapper';
import Header from './components/Header';
import Content from './components/Content';
import LeftSiderbar from './components/LeftSiderbar';
import RightSiderbar from './components/RightSiderbar';

import styles from './index.less';

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class TreeUiConfig extends Component {
  constructor(props) {
    super(props);
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const treeDataJson = get(modelUiConfig, 'tableData');
    const treeUiConfig = treeDataJson
      ? JSON.parse(treeDataJson)
      : {
          showSearchTooltip: true,
          allowCreateRoot: true,
          detailFields: [],
        };
    this.state = {
      treeUiConfig,
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
    const { modelUiConfig } = dataModelUiConfig;
    const { treeUiConfig = {} } = this.state;

    dispatch({
      type: 'dataModelUiConfig/saveModelUiConfig',
      payload: {
        modelUiConfig: { ...modelUiConfig, tableData: JSON.stringify(treeUiConfig) },
      },
    });
  };

  render() {
    const { dataModelUiConfig, loading } = this.props;
    const { currPRowData } = dataModelUiConfig;
    const { treeUiConfig } = this.state;

    return (
      <PageWrapper loading={loading.global}>
        <div className={cls(styles['visual-page-config'])}>
          <div className={cls('config-header')}>
            <Header onBack={this.handleBack} dataModel={currPRowData} />
          </div>
          <div className={cls('config-left-siderbar')}>
            <RightSiderbar
              editData={treeUiConfig}
              onEditTable={this.handleEditTable}
              onSave={this.handleSave}
            />
          </div>
          <div className={cls('config-content')}>
            <LeftSiderbar
              onFieldChange={this.handleFieldChange}
              dataModel={currPRowData}
              treeUiConfig={treeUiConfig}
              onDelField={this.handleDelField}
              onEditField={this.handleEditField}
            />
          </div>
          <div className={cls('config-right-siderbar')}>
            <Content treeUiConfig={treeUiConfig} dataModelCode={currPRowData.code} />
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default TreeUiConfig;
