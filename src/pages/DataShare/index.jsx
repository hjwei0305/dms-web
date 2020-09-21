import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { get } from 'lodash';
import cls from 'classnames';
import { Empty } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import CascadeLayout from '@/components/Layout/CascadeLayout';
import ExtTreePreview from '@/components/ExtTreePreview';
import ParentTable from './components/ParentTable';
import ChildTable from './components/ChildTable';
import styles from './index.less';

@withRouter
@connect(({ dataShare, loading }) => ({ dataShare, loading }))
class DataShare extends Component {
  getRightCmp = () => {
    const { dataShare } = this.props;
    const { currPRowData, modelUiConfig } = dataShare;
    const formUiConfig = JSON.parse(get(modelUiConfig, 'formData', null));
    const tableUiConfig = JSON.parse(get(modelUiConfig, 'tableData', null));
    const dataStructure = get(modelUiConfig, 'dataStructure', 'LIST');

    if (currPRowData && formUiConfig && tableUiConfig && dataStructure === 'TREE') {
      return (
        <ExtTreePreview
          key={currPRowData.id}
          slot="right"
          treeUiConfig={tableUiConfig}
          dataModelCode={modelUiConfig.code}
          formUiConfig={formUiConfig}
        />
      );
    }

    if (currPRowData && tableUiConfig && dataStructure === 'LIST') {
      return <ChildTable key={currPRowData.id} slot="right" modelUiConfig={modelUiConfig} />;
    }

    return null;
  };

  render() {
    const { dataShare, loading } = this.props;
    const { currPRowData } = dataShare;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <CascadeLayout
          title={['主数据', `${currPRowData ? `${currPRowData.name}数据订阅模块` : ''}`]}
          layout={[8, 16]}
        >
          <ParentTable slot="left" />
          {this.getRightCmp() || (
            <Empty slot="right" className={cls('empty-wrapper')} description="请选择左边的数据" />
          )}
        </CascadeLayout>
      </PageWrapper>
    );
  }
}

export default DataShare;
