import React, { Component } from 'react';
import ProLayout, { Header, Center } from '@/components/ProLayout';
import { Empty } from 'antd';
import { connect } from 'dva';
import Demo from './Demo';

@connect(({ dataShareDiagram, loading }) => ({ dataShareDiagram, loading }))
class RelationTree extends Component {
  getDrawer = () => {
    const { dataShareDiagram } = this.props;
    const { subList, currSelectedItem } = dataShareDiagram;
    if (subList && subList.length) {
      return (
        <Demo
          key={currSelectedItem.id}
          data={{
            ...currSelectedItem,
            isRoot: true,
            children: subList,
          }}
        />
      );
    }

    return (
      <Empty
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
        description={currSelectedItem ? '暂无订阅关系图' : '选择主数据查看订阅关系图'}
      />
    );
  };

  render() {
    const { dataShareDiagram } = this.props;
    const { currSelectedItem } = dataShareDiagram;
    return (
      <ProLayout layout="column">
        <Header
          title="订阅关系图"
          subTitle={currSelectedItem && currSelectedItem.name}
          gutter={[0, 2]}
        />
        <Center>{this.getDrawer()}</Center>
      </ProLayout>
    );
  }
}

export default RelationTree;
