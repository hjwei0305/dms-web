import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Input } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { utils, ExtIcon, ListCard } from 'suid';
import { constants, userUtils } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { Search } = Input;
const { getCurrentUser } = userUtils;
const { MDMSCONTEXT } = constants;
const { authAction } = utils;

@connect(({ dataDict, loading }) => ({ dataDict, loading }))
class DataDictTypeTable extends Component {
  state = {
    delRowId: null,
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataDict/updateState',
      payload: {
        showModal: true,
        currDictType: null,
      },
    });
  };

  edit = (currDictType, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataDict/updateState',
      payload: {
        showModal: true,
        currDictType,
      },
    });
    e.stopPropagation();
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataDict/save',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'dataDict/updateState',
          payload: {
            showModal: false,
          },
        });
        this.handlerSearch();
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'dataDict/del',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            this.setState({
              delRowId: null,
            });
            this.handlerSearch();
          }
        });
      },
    );
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataDict/updateState',
      payload: {
        showModal: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['dataDict/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading action-item" type="loading" antd />;
    }
    return (
      <ExtIcon onClick={e => e.stopPropagation()} className="del action-item" type="delete" antd />
    );
  };

  getFormModalProps = () => {
    const { loading, dataDict } = this.props;
    const { showModal, currDictType } = dataDict;
    return {
      save: this.save,
      rowData: currDictType,
      visible: showModal,
      onCancel: this.closeFormModal,
      saving: loading.effects['dataDict/save'],
    };
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.listCardRef.handlerSearch();
  };

  renderCustomTool = () => {
    const userInfo = getCurrentUser();
    const { authorityPolicy } = userInfo || {};
    const isGlobalAdmin = authorityPolicy === 'GlobalAdmin';
    return (
      <>
        <div className="tool-bar-left">
          {isGlobalAdmin ? (
            <Button type="link" icon="plus" onClick={this.add} ignore="true">
              <FormattedMessage id="global.add" defaultMessage="新建" />
            </Button>
          ) : null}
        </div>
        <div>
          <Search
            placeholder="输入代码或名称关键字查询"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerSearch}
            style={{ width: 220 }}
          />
        </div>
      </>
    );
  };

  handlerDictTypeSelect = (keys, items) => {
    const { dispatch } = this.props;
    const currDictType = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'dataDict/updateState',
      payload: {
        currDictType,
      },
    });
    dispatch({
      type: 'dataDict/getDataDictItems',
      payload: {
        dataDictId: currDictType.id,
      },
    });
  };

  renderTitle = item => {
    return (
      <>
        {item.name}
        <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>{item.code}</span>
      </>
    );
  };

  renderItemAction = record => {
    const userInfo = getCurrentUser();
    const { authorityPolicy } = userInfo || {};
    const isGlobalAdmin = authorityPolicy === 'GlobalAdmin';
    if (isGlobalAdmin) {
      return (
        <>
          <div className="tool-action" onClick={e => e.stopPropagation()}>
            {authAction(
              <ExtIcon
                key="edit"
                className="action-item"
                onClick={e => this.edit(record, e)}
                type="edit"
                ignore="true"
                antd
              />,
            )}
            {record.frozen ? null : (
              <Popconfirm
                key="del"
                placement="topLeft"
                title="确定要删除吗？"
                onCancel={e => e.stopPropagation()}
                onConfirm={e => {
                  this.del(record);
                  e.stopPropagation();
                }}
              >
                {this.renderDelBtn(record)}
              </Popconfirm>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  getListCardProps = () => {
    const { dataDict } = this.props;
    const { currDictType } = dataDict;
    const selectedKeys = currDictType ? [currDictType.id] : [];
    return {
      className: 'left-content',
      showSearch: false,
      showArrow: false,
      onSelectChange: this.handlerDictTypeSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      selectedKeys,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${MDMSCONTEXT}/dataDict/findByPage`,
      },
      itemField: {
        title: this.renderTitle,
        description: item => item.remark,
      },
      itemTool: this.renderItemAction,
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ListCard {...this.getListCardProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default DataDictTypeTable;
