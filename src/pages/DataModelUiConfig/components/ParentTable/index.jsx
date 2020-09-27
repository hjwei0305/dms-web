import React, { Component } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';
import cls from 'classnames';
import { ComboTree, ListCard } from 'suid';
import { constants } from '@/utils';

import styles from './index.less';

const { Search } = Input;
const { MDMSCONTEXT } = constants;

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
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
    return {
      placeholder: '选择主数据分类',
      style: {
        width: 150,
      },
      store: {
        url: `${MDMSCONTEXT}/dataModelType/getModelTypeTree`,
      },
      reader: {
        name: 'name',
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
      showSearch: false,
      store,
      onSelectChange: (_, [selectedItem]) => {
        dispatch({
          type: 'dataModelUiConfig/updatePageState',
          payload: {
            currPRowData: selectedItem,
          },
        }).then(() => {
          dispatch({
            type: 'dataModelUiConfig/getConfigById',
            payload: {
              id: selectedItem.id,
            },
          });
        });
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
      <div className={cls(styles['container-box'])}>
        <ListCard {...this.getListCardProps()} />
      </div>
    );
  }
}

export default CascadeTableMaster;
