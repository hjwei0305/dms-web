import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Input, Tag } from 'antd';
import { get } from 'lodash';
import { ListCard } from 'suid';
import PopoverIcon from '@/components/PopoverIcon';
import { constants } from '@/utils';
import styles from './index.less';

// const { authAction } = utils;
const { Search } = Input;
const { BASICCONTEXT } = constants;

@connect(({ innerOrder, loading }) => ({ innerOrder, loading }))
class ParentTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  handleSave = (data, cb) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'innerOrder/saveParent',
      payload: data,
    }).then(result => {
      const success = get(result, 'success');
      if (success) {
        cb(false);
        this.reloadData();
      }
    });
  };

  getCustomTool = () => {
    return (
      <>
        <div style={{ flex: 1 }}>
          <Search
            placeholder="请输入名称或代码查询"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerPressEnter}
            style={{ width: '100%' }}
          />
        </div>
      </>
    );
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['innerOrder/delPRow'] && delRowId === row.id) {
      return <PopoverIcon className="del-loading" type="loading" antd />;
    }
    return (
      <PopoverIcon
        onClick={e => e.stopPropagation()}
        tooltip={{ title: '删除' }}
        className="del"
        type="delete"
        antd
      />
    );
  };

  del = record => {
    const { dispatch, innerOrder } = this.props;
    const { currPRowData } = innerOrder;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'innerOrder/delPRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currPRowData && currPRowData.id === record.id) {
              dispatch({
                type: 'innerOrder/updatePageState',
                payload: {
                  currPRowData: null,
                },
              }).then(() => {
                this.setState({
                  delRowId: null,
                });
              });
            } else {
              this.setState({
                delRowId: null,
              });
            }
            this.reloadData();
          }
        });
      },
    );
  };

  getListCardProps = () => {
    const { dispatch } = this.props;

    return {
      showArrow: false,
      showSearch: false,
      store: {
        type: 'GET',
        url: `${BASICCONTEXT}/corporation/findAllUnfrozen`,
      },
      // remotePaging: true,
      onSelectChange: (_, [selectedItem]) => {
        dispatch({
          type: 'innerOrder/updatePageState',
          payload: {
            currPRowData: selectedItem,
          },
        });
      },
      searchProperties: ['code', 'name'],
      itemField: {
        title: item => (
          <>
            {`${item.name} `}
            {item.frozen ? <Tag color="red">冻结</Tag> : null}
          </>
        ),
        description: item => item.code,
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

export default ParentTable;
