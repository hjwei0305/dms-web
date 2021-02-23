import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Input, Button, Tag } from 'antd';
import { get } from 'lodash';
import { ListCard, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormPopover from './FormPopover';
import styles from './index.less';

// const { authAction } = utils;
const { Search } = Input;
const { MDMSCONTEXT } = constants;

@connect(({ dataShare, loading }) => ({ dataShare, loading }))
class CascadeTableMaster extends Component {
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
      type: 'dataShare/saveParent',
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
    const { loading } = this.props;
    return (
      <>
        <FormPopover onSave={this.handleSave} isSaving={loading.effects['dataShare/saveParent']}>
          <Button type="link">
            <ExtIcon type="plus" antd /> 新增
          </Button>
        </FormPopover>
        <div>
          <Search
            placeholder="请输入名称或代码关键字进行查询"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerPressEnter}
            style={{ width: 172 }}
          />
        </div>
      </>
    );
  };

  getListCardProps = () => {
    const { dispatch, loading } = this.props;

    return {
      // title: this.getCustomTool(),
      showSearch: false,
      store: {
        type: 'POST',
        url: `${MDMSCONTEXT}/appSubscription/findAppByPage`,
      },
      remotePaging: true,
      onSelectChange: (_, [selectedItem]) => {
        dispatch({
          type: 'dataShare/updatePageState',
          payload: {
            currPRowData: selectedItem,
          },
        }).then(() => {
          dispatch({
            type: 'dataShare/getConfigById',
            payload: {
              id: selectedItem.id,
            },
          });
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
        extra: item => {
          return (
            <FormPopover
              onSave={this.handleSave}
              isSaving={loading.effects['dataShare/saveParent']}
              editData={item}
            >
              <span className={cls('icon-wrapper')}>
                <ExtIcon type="edit" tooltip={{ title: '编辑' }} antd />
              </span>
            </FormPopover>
          );
        },
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
