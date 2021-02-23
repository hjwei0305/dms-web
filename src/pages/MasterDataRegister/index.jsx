import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty, PageHeader } from 'antd';
import PageWrapper from '@/components/PageWrapper';
// import CascadeLayout from '@/components/Layout/CascadeLayout';
import ProLayout, { Header, Center, SiderBar } from '@/components/ProLayout';
import TablePanel from './components/TablePanel';
import TreePanel from './components/TreePanel';
import ConfigModelFields from './components/ConfigModelFields';
import styles from './index.less';

@withRouter
@connect(({ masterDataRegister, loading }) => ({ masterDataRegister, loading }))
class MasterDataRegister extends Component {
  // componentDidMount() {
  //   const { dispatch, } = this.props;
  //   dispatch({
  //     type: "masterDataRegister/queryTree"
  //   });
  // }

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'masterDataRegister/updateState',
      payload: {
        configModelData: null,
      },
    });
  };

  render() {
    const { masterDataRegister, loading } = this.props;
    const { currNode, configModelData } = masterDataRegister;

    return (
      <>
        <PageWrapper
          loading={loading.global}
          className={cls({
            [styles['container-box']]: true,
            hide_ele: !!configModelData,
          })}
        >
          <ProLayout>
            <SiderBar allowCollapse gutter={[0, 8]}>
              <ProLayout layout="column">
                <Header height={60}>
                  <PageHeader title="主数据类型" />
                </Header>
                <Center style={{ padding: 8 }}>
                  <TreePanel
                    slot="left"
                    slotClassName={cls('left-slot-wrapper')}
                    onSelect={this.handleSelect}
                  />
                </Center>
              </ProLayout>
            </SiderBar>
            <Center>
              <ProLayout layout="column">
                <Header height={60}>
                  <PageHeader
                    title={currNode && currNode.name}
                    // subTitle="注册"
                  />
                </Header>
                <Center>
                  {currNode ? (
                    <TablePanel slot="right" slotClassName={cls('right-slot-wrapper')} />
                  ) : (
                    <Empty
                      slot="right"
                      className={cls('empty-wrapper')}
                      description="请选择左边的树节点进行操作"
                    />
                  )}
                </Center>
              </ProLayout>
            </Center>
          </ProLayout>
          {/* <CascadeLayout title={['主数据类型', currNode && currNode.name]} layout={[6, 18]}>
            <TreePanel
              slot="left"
              slotClassName={cls('left-slot-wrapper')}
              onSelect={this.handleSelect}
            />
            {currNode ? (
              <TablePanel slot="right" slotClassName={cls('right-slot-wrapper')} />
            ) : (
              <Empty
                slot="right"
                className={cls('empty-wrapper')}
                description="请选择左边的树节点进行操作"
              />
            )}
          </CascadeLayout> */}
        </PageWrapper>
        {configModelData ? (
          <ConfigModelFields goBack={this.handleBack} dataModel={configModelData} />
        ) : null}
      </>
    );
  }
}

export default MasterDataRegister;
