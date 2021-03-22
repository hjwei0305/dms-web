import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { ProLayout } from 'suid';
import SemantemeTypeTable from './components/SemantemeTypeTable';
import SemantemeTable from './components/SemantemeTable';
import PageWrapper from '@/components/PageWrapper';
import styles from './index.less';

const { SiderBar, Content, Header } = ProLayout;

@withRouter
@connect(({ semanteme, loading }) => ({ semanteme, loading }))
class Semanteme extends Component {
  render() {
    const { semanteme, loading } = this.props;
    const { currType } = semanteme;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <ProLayout>
          <SiderBar width={350} gutter={[0, 4]}>
            <ProLayout>
              <Header title="语义类型" />
              <Content>
                <SemantemeTypeTable />
              </Content>
            </ProLayout>
          </SiderBar>
          <ProLayout>
            <Header title="译文" subTitle={currType && currType.remark} />
            <Content empty={{ description: '请选择语义类型' }}>
              {currType && <SemantemeTable />}
            </Content>
          </ProLayout>
        </ProLayout>
      </PageWrapper>
    );
  }
}

export default Semanteme;
