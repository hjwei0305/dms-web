import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { ProLayout } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import TablePanel from './components/TablePanel';
import TreePanel from './components/TreePanel';
// import ConfigModelFields from './components/ConfigModelFields';

const { Header, Content, SiderBar } = ProLayout;

@withRouter
@connect(({ masterDataRegister, loading }) => ({ masterDataRegister, loading }))
class MasterDataRegister extends Component {
  render() {
    const { masterDataRegister, loading } = this.props;
    const { currNode } = masterDataRegister;

    return (
      <>
        <PageWrapper loading={loading.global}>
          <ProLayout>
            <SiderBar width={300} allowCollapse gutter={[0, 8]}>
              <ProLayout>
                <Header title="主数据类型" />
                <Content style={{ padding: 8 }}>
                  <TreePanel onSelect={this.handleSelect} />
                </Content>
              </ProLayout>
            </SiderBar>
            <ProLayout>
              <Header title="注册主数据" subTitle={currNode && currNode.name} />
              <Content empty={{ description: '请选择左边的树节点进行操作' }}>
                {currNode && <TablePanel />}
              </Content>
            </ProLayout>
          </ProLayout>
        </PageWrapper>
        {/* {configModelData ? (
          <ConfigModelFields goBack={this.handleBack} dataModel={configModelData} />
        ) : null} */}
      </>
    );
  }
}

export default MasterDataRegister;
