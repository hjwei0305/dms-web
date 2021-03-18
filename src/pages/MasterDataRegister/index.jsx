import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { ProLayout } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import TablePanel from './components/TablePanel';
import TreePanel from './components/TreePanel';
import ConfigModelFields from './components/ConfigModelFields';
import styles from './index.less';

const { Header, Content, SiderBar } = ProLayout;

@withRouter
@connect(({ masterDataRegister, loading }) => ({ masterDataRegister, loading }))
class MasterDataRegister extends Component {
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
                <Header title="主数据类型" />
                <Content style={{ padding: 8 }}>
                  <TreePanel
                    slotClassName={cls('left-slot-wrapper')}
                    onSelect={this.handleSelect}
                  />
                </Content>
              </ProLayout>
            </SiderBar>
            <ProLayout layout="column">
              <Header title="注册主数据" subTitle={currNode && currNode.name} />
              <Content empty={{ description: '请选择左边的树节点进行操作' }}>
                {currNode && <TablePanel slot="right" slotClassName={cls('right-slot-wrapper')} />}
              </Content>
            </ProLayout>
          </ProLayout>
        </PageWrapper>
        {configModelData ? (
          <ConfigModelFields goBack={this.handleBack} dataModel={configModelData} />
        ) : null}
      </>
    );
  }
}

export default MasterDataRegister;
