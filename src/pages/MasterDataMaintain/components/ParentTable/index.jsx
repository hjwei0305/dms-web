import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Input } from 'antd';
import { ListCard, ComboTree } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

// const { authAction } = utils;
const { Search } = Input;
const { MDMSCONTEXT } = constants;

@connect(({ masterDataMaintain, loading }) => ({ masterDataMaintain, loading }))
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
            flex: 1,
            paddingLeft: 8,
          }}
        >
          <Search
            placeholder="可输入名称关键字查询"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerSearch}
            style={{ width: '100%' }}
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
        const { masterDataMaintain } = this.props;
        const { currPRowData } = masterDataMaintain;
        const { id } = currPRowData || {};
        if (selectedItem.id !== id) {
          dispatch({
            type: 'masterDataMaintain/updatePageState',
            payload: {
              currPRowData: selectedItem,
              modelUiConfig: null,
            },
          }).then(() => {
            dispatch({
              type: 'masterDataMaintain/getConfigById',
              payload: {
                id: selectedItem.id,
              },
            });
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
      <div className={cls(styles['container-box'])}>
        <ListCard {...this.getListCardProps()} />
      </div>
    );
  }
}

export default CascadeTableMaster;
