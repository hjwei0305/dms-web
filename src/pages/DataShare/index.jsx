import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { ProLayout } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import ParentTable from './components/ParentTable';
import ChildTable from './components/ChildTable';

const { Header, Content, SiderBar } = ProLayout;

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
      <PageWrapper loading={loading.global}>
        <ProLayout>
          <SiderBar allowCollapse gutter={[0, 8]}>
            <ProLayout layout="column">
              <Header title="应用模块" />
              <Content>
                <ParentTable />
              </Content>
            </ProLayout>
          </SiderBar>
          <ProLayout layout="column">
            <Header title="订阅数据" subTitle={currPRowData && currPRowData.name} />
            <Content empty={{ description: '请选择应用模块进行订阅数据' }}>
              {this.getRightCmp()}
            </Content>
          </ProLayout>
        </ProLayout>
      </PageWrapper>
    );
  }
}

export default DataShare;
