import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { ProLayout } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import ParentTable from './components/ParentTable';
import ChildTable from './components/ChildTable';

const { Header, Content, SiderBar } = ProLayout;

@withRouter
@connect(({ innerOrder, loading }) => ({ innerOrder, loading }))
class InnerOrder extends Component {
  getRightCmp = () => {
    const { innerOrder } = this.props;
    const { currPRowData } = innerOrder;
    if (currPRowData) {
      return <ChildTable key={currPRowData.id} />;
    }

    return null;
  };

  render() {
    const { innerOrder, loading } = this.props;
    const { currPRowData } = innerOrder;

    return (
      <PageWrapper loading={loading.global}>
        <ProLayout>
          <SiderBar width={350} allowCollapse gutter={[0, 4]}>
            <ProLayout layout="column">
              <Header title="公司列表" />
              <Content>
                <ParentTable />
              </Content>
            </ProLayout>
          </SiderBar>
          <ProLayout layout="column">
            <Header title="内部订单" subTitle={currPRowData && currPRowData.name} />
            <Content empty={{ description: '请选择公司' }}>{this.getRightCmp()}</Content>
          </ProLayout>
        </ProLayout>
      </PageWrapper>
    );
  }
}

export default InnerOrder;
