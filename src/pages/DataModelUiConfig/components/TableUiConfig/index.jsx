import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
// import { message, } from 'antd';
import { get } from 'lodash';
import PageWrapper from '@/components/PageWrapper';
import Header from './components/Header';
import Content from './components/Content';
import LeftSiderbar from './components/LeftSiderbar';
import RightSiderbar from './components/RightSiderbar';

import styles from './index.less';

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class TableUiConfig extends Component {
  constructor(props) {
    super(props);
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const tableDataJson = get(modelUiConfig, 'tableData');
    const tableUiConfig = tableDataJson
      ? JSON.parse(tableDataJson)
      : {
          store: {
            type: 'POST',
            url: '',
          },
          showSearchTooltip: true,
          allowCustomColumns: true,
          remotePaging: true,
          columns: [],
        };
    this.state = {
      tableUiConfig,
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

  handleColChange = columns => {
    const { tableUiConfig = {} } = this.state;
    Object.assign(tableUiConfig, { columns });
    this.setState({
      tableUiConfig,
    });
  };

  handleDelCol = col => {
    const { tableUiConfig = {} } = this.state;
    const { columns = [] } = tableUiConfig;
    const tempColumns = columns.filter(item => item.dataIndex !== col.dataIndex);
    Object.assign(tableUiConfig, { columns: tempColumns });
    this.setState({
      tableUiConfig,
    });
  };

  handleEditCol = col => {
    const { tableUiConfig = {} } = this.state;
    const { columns = [] } = tableUiConfig;

    const tempColumns = columns.map(item => {
      if (item.dataIndex !== col.dataIndex) {
        return item;
      }
      return col;
    });
    Object.assign(tableUiConfig, { columns: tempColumns });
    this.setState({
      tableUiConfig,
    });
  };

  handleEditTable = props => {
    const { dispatch, dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const { tableUiConfig = {} } = this.state;

    Object.assign(tableUiConfig, props);
    this.setState({
      tableUiConfig,
    });
    dispatch({
      type: 'dataModelUiConfig/saveModelUiConfig',
      payload: {
        modelUiConfig: { ...modelUiConfig, tableData: JSON.stringify(tableUiConfig) },
      },
    });
  };

  render() {
    const { dataModelUiConfig, loading } = this.props;
    const { currPRowData } = dataModelUiConfig;
    const { tableUiConfig } = this.state;

    return (
      <PageWrapper loading={loading.global}>
        <div className={cls(styles['visual-page-config'])}>
          <div className={cls('config-header')}>
            <Header onBack={this.handleBack} dataModel={currPRowData} />
          </div>
          <div className={cls('config-left-siderbar')}>
            <RightSiderbar editData={tableUiConfig} onEditTable={this.handleEditTable} />
          </div>
          <div className={cls('config-content')}>
            <LeftSiderbar
              onColChange={this.handleColChange}
              dataModel={currPRowData}
              tableUiConfig={tableUiConfig}
              onDelCol={this.handleDelCol}
              onEditCol={this.handleEditCol}
            />
          </div>
          <div className={cls('config-right-siderbar')}>
            <Content tableUiConfig={tableUiConfig} />
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default TableUiConfig;
