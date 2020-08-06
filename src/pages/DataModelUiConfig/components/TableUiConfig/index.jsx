import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import Header from './components/Header';
import Content from './components/Content';
import LeftSiderbar from './components/LeftSiderbar';
import RightSiderbar from './components/RightSiderbar';

import styles from './index.less';

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class TableUiConfig extends Component {
  state = {
    tableUiConfig: {
      store: {
        type: 'POST',
        url: '',
      },
      showSearchTooltip: true,
      allowCustomColumns: true,
      remotePaging: true,
      columns: [],
    },
  };

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
    const { tableUiConfig = {} } = this.state;

    Object.assign(tableUiConfig, props);
    console.log('TableUiConfig -> tableUiConfig', JSON.stringify(tableUiConfig));
    this.setState({
      tableUiConfig,
    });
  };

  render() {
    const { dataModelUiConfig } = this.props;
    const { currPRowData } = dataModelUiConfig;
    const { tableUiConfig } = this.state;

    return (
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
    );
  }
}

export default TableUiConfig;
