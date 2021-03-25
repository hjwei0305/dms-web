import React, { PureComponent } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { ProLayout } from 'suid';
import { Tag } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import DataDictTypeTable from './components/DataDictTypeTable';
import DataDictTable from './components/DataDictTable';
import styles from './index.less';

const { SiderBar, Header, Content } = ProLayout;

@withRouter
@connect(({ dataDict, loading }) => ({ dataDict, loading }))
class DataDict extends PureComponent {
  getTags = () => {
    const { dataDict } = this.props;
    const { isPrivateDictItems } = dataDict;
    let color = 'cyan';
    let text = '通用';

    if (isPrivateDictItems) {
      color = 'orange';
      text = '私有';
    }

    return <Tag color={color}>{text}</Tag>;
  };

  render() {
    const { loading, dataDict } = this.props;
    const { currDictType } = dataDict;

    return (
      <PageWrapper className={cls(styles['container-box'])} spinning={loading.global}>
        <ProLayout>
          <SiderBar width={350} allowCollapse gutter={[0, 4]}>
            <ProLayout>
              <Header title="字典类型" />
              <Content>
                <DataDictTypeTable />
              </Content>
            </ProLayout>
          </SiderBar>
          <ProLayout>
            <Header
              title="数据字典项"
              subTitle={currDictType && currDictType.name}
              tags={this.getTags()}
            />
            <Content empty={{ description: '请选择字典类型' }}>
              {currDictType && <DataDictTable />}
            </Content>
          </ProLayout>
        </ProLayout>
      </PageWrapper>
    );
  }
}

export default DataDict;
