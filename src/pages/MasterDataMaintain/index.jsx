import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import CascadeLayout from '@/components/Layout/CascadeLayout';
import ParentTable from './components/ParentTable';
import ChildTable from './components/ChildTable';
import styles from './index.less';

@withRouter
@connect(({ masterDataMaintain, loading }) => ({ masterDataMaintain, loading }))
class MasterDataMaintain extends Component {
  render() {
    const { masterDataMaintain, loading } = this.props;
    const { currPRowData, modelUiConfig } = masterDataMaintain;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <CascadeLayout
          title={['主数据', `${currPRowData ? `${currPRowData.name}的数据` : ''}`]}
          layout={[10, 14]}
        >
          <ParentTable slot="left" />
          {currPRowData && modelUiConfig ? (
            <ChildTable key={currPRowData.id} slot="right" modelUiConfig={modelUiConfig} />
          ) : (
            <Empty slot="right" className={cls('empty-wrapper')} description="请选择左边的数据" />
          )}
        </CascadeLayout>
      </PageWrapper>
    );
  }
}

export default MasterDataMaintain;
