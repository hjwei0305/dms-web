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
@connect(({ dataShare, loading }) => ({ dataShare, loading }))
class DataShare extends Component {
  getRightCmp = () => {
    const { dataShare } = this.props;
    const { currPRowData } = dataShare;
    if (currPRowData) {
      return <ChildTable key={currPRowData.id} slot="right" />;
    }

    return null;
  };

  render() {
    const { dataShare, loading } = this.props;
    const { currPRowData } = dataShare;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <CascadeLayout
          title={['应用模块', `${currPRowData ? `${currPRowData.name}的订阅数据` : ''}`]}
          layout={[8, 16]}
          canShrink
        >
          <ParentTable slot="left" />
          {this.getRightCmp() || (
            <Empty
              slot="right"
              className={cls('empty-wrapper')}
              description="请选择应用模块进行订阅数据"
            />
          )}
        </CascadeLayout>
      </PageWrapper>
    );
  }
}

export default DataShare;
