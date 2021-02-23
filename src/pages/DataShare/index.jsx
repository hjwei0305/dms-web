import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty, PageHeader } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import ProLayout, { Header, Center, SiderBar } from '@/components/ProLayout';
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
        <ProLayout>
          <SiderBar allowCollapse gutter={[0, 8]}>
            <ProLayout layout="column">
              <Header height={60}>
                <PageHeader title="应用模块" />
              </Header>
              <Center>
                <ParentTable />
              </Center>
            </ProLayout>
          </SiderBar>
          <Center>
            <ProLayout layout="column">
              <Header height={60}>
                <PageHeader
                  title={`${currPRowData ? `订阅数据` : ''}`}
                  subTitle={currPRowData.name}
                />
              </Header>
              <Center>
                {this.getRightCmp() || (
                  <Empty
                    slot="right"
                    className={cls('empty-wrapper')}
                    description="请选择应用模块进行订阅数据"
                  />
                )}
              </Center>
            </ProLayout>
          </Center>
        </ProLayout>
      </PageWrapper>
    );
  }
}

export default DataShare;
