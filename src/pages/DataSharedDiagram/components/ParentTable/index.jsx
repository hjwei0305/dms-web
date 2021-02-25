import React, { Component } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';
import cls from 'classnames';
import { ComboTree, ListCard } from 'suid';
import ProLayout, { Header, Center } from '@/components/ProLayout';
import { constants } from '@/utils';

import styles from './index.less';

const { Search } = Input;
const { MDMSCONTEXT } = constants;

@connect(({ dataShareDiagram, loading }) => ({ dataShareDiagram, loading }))
class CascadeTableMaster extends Component {
  state = {
    selectedNode: null,
  };

  reloadData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.listCardRef.handlerSearch();
  };

  getComboTreeProps = () => {
    const { selectedNode: selNode } = this.state;

    let value = '';
    if (selNode) {
      value = selNode.name;
    }
    return {
      value,
      placeholder: '选择主数据分类',
      style: {
        width: 150,
      },
      store: {
        url: `${MDMSCONTEXT}/dataCategory/getTypeTree`,
        autoLoad: true,
      },
      reader: {
        name: 'name',
      },
      afterLoaded: data => {
        const [selectedNode] = data || [];
        if (selectedNode) {
          this.handleAfterSelect(selectedNode);
        }
      },
    };
  };

  handleAfterSelect = selectedNode => {
    this.setState(
      {
        selectedNode,
      },
      () => {
        this.reloadData();
      },
    );
  };

  getCustomTool = () => {
    return (
      <>
        <ComboTree width={200} afterSelect={this.handleAfterSelect} {...this.getComboTreeProps()} />
        <div
          style={{
            paddingLeft: 20,
          }}
        >
          <Search
            placeholder="可输入名称关键字查询"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerSearch}
            style={{ width: 172 }}
          />
        </div>
      </>
    );
  };

  getListCardProps = () => {
    const { dispatch } = this.props;
    const { selectedNode } = this.state;
    let store = null;
    if (selectedNode) {
      store = {
        type: 'Get',
        url: `${MDMSCONTEXT}/dataDefinition/getRegisterDataByCategoryId?categoryId=${selectedNode.id}`,
      };
    }

    return {
      showArrow: false,
      showSearch: false,
      store,
      onSelectChange: (_, [selectedItem]) => {
        const { dataShareDiagram } = this.props;
        const { currSelectedItem } = dataShareDiagram;
        const { id } = currSelectedItem || {};
        if (selectedItem.id !== id) {
          dispatch({
            type: 'dataShareDiagram/onItemSelected',
            payload: {
              currSelectedItem: selectedItem,
              subList: null,
            },
          });
        }
      },
      searchProperties: ['code', 'name'],
      itemField: {
        title: item => `${item.name}【${item.code}】`,
        description: item => item.dataStructureEnumRemark,
      },
      onListCardRef: ref => (this.listCardRef = ref),
      customTool: this.getCustomTool,
    };
  };

  render() {
    return (
      <ProLayout layout="column" className={cls(styles['container-box'])}>
        <Header title="主数据" gutter={[0, 2]} />
        <Center>
          <ListCard {...this.getListCardProps()} />
        </Center>
      </ProLayout>
    );
  }
}

export default CascadeTableMaster;
