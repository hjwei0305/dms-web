import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Select, Input } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { isEqual } from 'lodash';
import { ExtTable } from 'suid';
import { constants } from '@/utils';
import styles from '../../index.less';

const { MDMSCONTEXT } = constants;

@connect(({ semanteme, loading }) => ({ semanteme, loading }))
class SemantemeTable extends Component {
  state = {
    showModal: false,
    rowData: null,
    selectedRowKeys: [],
  };

  reloadData = () => {
    const { semanteme } = this.props;
    const { currType, currLanguageId } = semanteme;
    if (currType && currLanguageId) {
      this.tableRef && this.tableRef.remoteDataRefresh();
    } else {
      // message.warn('请选择数据字典');
    }
  };

  handleSave = rowData => {
    const { dispatch, semanteme } = this.props;
    const { currType, currLanguageId } = semanteme;

    dispatch({
      type: 'semanteme/save',
      payload: {
        propertyValue: rowData.propertyValue,
        transValue: this.transValue || rowData.transValue,
        semantemeTypeId: currType && currType.id,
        languageId: currLanguageId,
      },
    }).then(res => {
      if (res.success) {
        this.setState({
          selectedRowKeys: [],
        });
        this.reloadData();
      }
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'semanteme/saveDictItem',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        this.setState(
          {
            showModal: false,
          },
          () => {
            this.reloadData();
          },
        );
      }
    });
  };

  getExtableProps = () => {
    const { selectedRowKeys } = this.state;
    const { semanteme, dispatch } = this.props;
    const { languageTypes, currType, currLanguageId } = semanteme;
    const columns = [
      {
        title: '属性值',
        dataIndex: 'propertyValue',
        width: 220,
        required: true,
      },
      {
        title: '译文',
        dataIndex: 'transValue',
        width: 420,
        required: true,
        render: (text, record) => {
          const { selectedRowKeys: tSelectedRowKeys } = this.state;
          if (tSelectedRowKeys.includes(`${record.propertyName}${record.propertyValue}`)) {
            return (
              <Input
                onPressEnter={() => this.handleSave(record)}
                onChange={e => (this.transValue = e.target.value)}
                autoFocus
                defaultValue={text}
              />
            );
          }
          return text;
        },
      },
    ];

    const selectCmp = (
      <Select
        style={{ width: 180, marginRight: 8 }}
        onChange={value => {
          dispatch({
            type: 'semanteme/updateState',
            payload: {
              currLanguageId: value,
            },
          });
        }}
        value={currLanguageId}
      >
        {languageTypes.map(item => {
          return <Select.Option value={item.id}>{item.name}</Select.Option>;
        })}
      </Select>
    );

    const toolBarProps = {
      left: (
        <Fragment>
          {selectCmp}
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </Fragment>
      ),
    };
    return {
      bordered: false,
      cascadeParams: {
        languageId: currLanguageId,
        semantemeTypeId: currType && currType.id,
      },
      selectedRowKeys,
      rowKey: item => {
        return `${item.propertyName}${item.propertyValue}`;
      },
      searchProperties: ['propertyName', 'propertyValue', 'transValue'],
      onSelectRow: selectedKeys => {
        this.transValue = '';
        let tempKeys = selectedKeys;
        if (isEqual(selectedKeys, selectedRowKeys)) {
          tempKeys = [];
        }
        this.setState({
          selectedRowKeys: tempKeys,
        });
      },
      columns,
      remotePaging: true,
      toolBar: toolBarProps,
      allowCancelSelect: true,
      store: {
        type: 'POST',
        url: `${MDMSCONTEXT}translation/findTranslationsByPage`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, semanteme } = this.props;
    const { currDictType } = semanteme;
    const { showModal, rowData } = this.state;
    return {
      save: this.save,
      dictType: currDictType,
      rowData,
      visible: showModal,
      onCancel: this.closeFormModal,
      saving: loading.effects['semanteme/saveDictItem'],
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
      </div>
    );
  }
}

export default SemantemeTable;
