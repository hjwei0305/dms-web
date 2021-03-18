import React, { Component } from 'react';
import { ProLayout } from 'suid';
import { connect } from 'dva';
import TreeGraph from './TreeGraph';

const { Header, Content } = ProLayout;

@connect(({ dataShareDiagram, loading }) => ({ dataShareDiagram, loading }))
class RelationTree extends Component {
  getDrawer = () => {
    const { dataShareDiagram } = this.props;
    const { subList, currSelectedItem } = dataShareDiagram;
    if (subList && subList.length) {
      return (
        <TreeGraph
          key={currSelectedItem.id}
          data={{
            ...currSelectedItem,
            isRoot: true,
            children: subList,
          }}
        />
      );
    }

    return null;
  };

  render() {
    const { dataShareDiagram } = this.props;
    const { currSelectedItem } = dataShareDiagram;
    return (
      <ProLayout layout="column">
        <Header title="订阅关系图" subTitle={currSelectedItem && currSelectedItem.name} />
        <Content
          empty={{
            description: currSelectedItem ? '暂无订阅关系图' : '选择主数据查看订阅关系图',
          }}
        >
          {this.getDrawer()}
        </Content>
      </ProLayout>
    );
  }
}

export default RelationTree;
