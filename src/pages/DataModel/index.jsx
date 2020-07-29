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
@connect(({ dataModel, loading }) => ({ dataModel, loading }))
class DataModel extends Component {
  render() {
    const { dataModel, loading } = this.props;
    const { currPRowData } = dataModel;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <CascadeLayout
          title={['数据模型', `${currPRowData ? currPRowData.name : ''}`]}
          layout={[10, 14]}
        >
          <ParentTable slot="left" />
          {currPRowData ? (
            <ChildTable slot="right" />
          ) : (
            <Empty slot="right" className={cls('empty-wrapper')} description="请选择左边的数据" />
          )}
        </CascadeLayout>
      </PageWrapper>
    );
  }
}

export default DataModel;
