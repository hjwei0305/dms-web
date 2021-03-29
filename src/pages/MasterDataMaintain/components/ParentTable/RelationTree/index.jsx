import React, { Component } from 'react';
import { ProLayout } from 'suid';
import { message } from 'antd';
import TreeGraph from './TreeGraph';
import { getAppFromDataCode } from '../../../service';

const { Header, Content, StackLayout } = ProLayout;

class RelationTree extends Component {
  state = {
    subList: [],
    loading: false,
  };

  componentDidMount() {
    this.getSubList();
  }

  getSubList() {
    const { masterData } = this.props;
    if (masterData) {
      this.setState({
        loading: true,
      });
      getAppFromDataCode({ dataCode: masterData.code })
        .then(({ success, data, message: msg }) => {
          if (success) {
            this.setState({
              subList: data,
            });
          } else {
            message.error(msg);
          }
        })
        .catch(err => {
          message.error(err || err.message);
        })
        .finally(() => {
          this.setState({
            loading: false,
          });
        });
    }
  }

  getDrawer = () => {
    const { masterData } = this.props;
    const { subList } = this.state;
    if (subList && subList.length) {
      return (
        <TreeGraph
          key={masterData.id}
          data={{
            ...masterData,
            isRoot: true,
            children: subList,
          }}
        />
      );
    }

    return null;
  };

  render() {
    const { masterData, onBack } = this.props;
    return (
      <StackLayout visible={!!masterData} isFullscreen zIndex={20} destroyOnClose>
        <Header onBack={onBack} title="订阅关系图" subTitle={masterData && masterData.name} />
        <Content
          empty={{
            description: masterData ? '暂无订阅关系图' : '选择主数据查看订阅关系图',
          }}
        >
          {this.getDrawer()}
        </Content>
      </StackLayout>
    );
  }
}

export default RelationTree;
