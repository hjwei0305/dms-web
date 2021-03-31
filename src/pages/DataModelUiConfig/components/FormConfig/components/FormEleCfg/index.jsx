import React, { Component } from 'react';
import cls from 'classnames';
import { cloneDeep, get } from 'lodash';
import { Dropdown, Menu, Popconfirm, Button, Empty } from 'antd';
import { ScrollBar, ExtIcon } from 'suid';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getPropertiesByCode } from '@/pages/DataModelUiConfig/service';
// import EditModal from './EditModal';
import EditDrawer from './EditDrawer';

import styles from './index.less';

class FormEleCfg extends Component {
  state = {
    fieldLists: [],
    showUnAssign: false,
    editData: null,
    optKey: null,
    selectedItem: null,
  };

  componentDidMount() {
    this.getPropertiesByCode().then(result => {
      const { success, data } = result;
      if (success) {
        this.setState({
          fieldLists: data || [],
        });
      }
    });
  }

  getPropertiesByCode = () => {
    const { dataModel } = this.props;

    return getPropertiesByCode({
      code: dataModel.code,
    });
  };

  toggoleShowUnAssign = () => {
    const { showUnAssign } = this.state;
    this.setState({
      showUnAssign: !showUnAssign,
    });
  };

  handleAddFormItem = item => {
    const { onFormItemChange, uiConfig } = this.props;
    const { code, name } = item;
    const { formItems } = uiConfig || {};
    const tempFormItems = formItems ? cloneDeep(formItems) : [];
    const tempFormItem = [
      {
        code,
        name,
      },
      {
        title: name,
        'ui:widget': 'ExtInput',
      },
      {
        title: name,
        'ui:widget': 'ExtInput',
      },
      {
        title: name,
        'ui:widget': 'ExtInput',
      },
    ];
    tempFormItems.push(tempFormItem);
    if (onFormItemChange) {
      onFormItemChange(tempFormItems);
    }
  };

  handleDelFormItem = item => {
    const { onDelFormItem } = this.props;
    if (onDelFormItem) {
      onDelFormItem(item);
    }
  };

  handleToggoleEditModal = (optKey, editData) => {
    this.setState({
      editData,
      optKey,
    });
  };

  handleEditFormItem = item => {
    const { onEditFormItem } = this.props;
    if (onEditFormItem) {
      onEditFormItem(cloneDeep(item));
      this.setState({
        editData: null,
      });
    }
  };

  onDragEnd = result => {
    const { destination, source } = result;
    const { onFormItemChange, uiConfig } = this.props;
    const { formItems } = uiConfig || {};
    const tempFormItems = formItems ? cloneDeep(formItems) : [];
    if (destination && source) {
      const arrItem = tempFormItems[destination.index];
      tempFormItems[destination.index] = tempFormItems[source.index];
      tempFormItems[source.index] = arrItem;
      if (onFormItemChange) {
        onFormItemChange(tempFormItems);
      }
    }
  };

  handleCancel = () => {
    this.setState({
      editData: null,
    });
  };

  handleSelectItem = selectedItem => {
    const { onSelect } = this.props;
    this.setState(
      {
        selectedItem,
      },
      () => {
        if (onSelect) {
          onSelect(selectedItem);
        }
      },
    );
  };

  getEditModalProps = () => {
    const { editData, fieldLists, optKey } = this.state;

    return {
      editData,
      optKey,
      fieldLists,
      onCancel: this.handleCancel,
      onSave: this.handleEditFormItem,
    };
  };

  getMenus = item => {
    const { uiConfig } = this.props;
    const canCreateRoot = get(uiConfig, 'canCreateRoot', false);
    if (canCreateRoot) {
      return (
        <Menu
          onClick={({ key }) => {
            this.handleToggoleEditModal(key, item);
          }}
        >
          <Menu.Item key="1">新建表单</Menu.Item>
          <Menu.Item key="2">编辑表单</Menu.Item>
          <Menu.Item key="3">新建根结点表单</Menu.Item>
        </Menu>
      );
    }

    return (
      <Menu
        onClick={({ key }) => {
          this.handleToggoleEditModal(key, item);
        }}
      >
        <Menu.Item key="1">新建表单</Menu.Item>
        <Menu.Item key="2">编辑表单</Menu.Item>
      </Menu>
    );
  };

  render() {
    const { fieldLists, showUnAssign, editData, optKey, selectedItem } = this.state;
    const { uiConfig } = this.props;
    const formItems = get(uiConfig, 'formItems', []);

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className={cls(styles['left-sider-bar'])}>
          <div className={cls('title')}>
            {showUnAssign ? (
              <>
                <span className={cls('back-icon')}>
                  <ExtIcon
                    type="left"
                    tooltip={{ title: '返回' }}
                    onClick={this.toggoleShowUnAssign}
                    antd
                  />
                </span>
                可配表单元素
              </>
            ) : (
              '已配表单元素'
            )}
            {showUnAssign ? null : (
              <span className={cls('title-extra')}>
                <ExtIcon
                  type="plus"
                  tooltip={{ title: '添加表单元素' }}
                  onClick={this.toggoleShowUnAssign}
                  antd
                />
              </span>
            )}
          </div>
          <div className={cls('content')}>
            <Droppable
              droppableId="board"
              type="COLUMN"
              // direction="horizontal"
              // ignoreContainerClipping={Boolean(containerHeight)}
              // isCombineEnabled={isCombineEnabled}
            >
              {provided => (
                <ul
                  className={cls('list-items')}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <ScrollBar>
                    {formItems.length ? (
                      formItems.map((item, index) => {
                        const [{ code: fieldName, name: title }] = item;
                        return (
                          <Draggable
                            draggableId={fieldName}
                            index={index}
                            key={fieldName}
                            // isDragDisabled={isDragDisabled}
                          >
                            {(dragprovided, snapshot) => (
                              <li
                                className={cls({
                                  'list-item': true,
                                  'list-item-selected':
                                    selectedItem && selectedItem[0].code === fieldName,
                                })}
                                {...dragprovided.draggableProps}
                                {...dragprovided.dragHandleProps}
                                ref={dragprovided.innerRef}
                                isdragging={snapshot.isDragging}
                                title={title}
                                onClick={() => this.handleSelectItem(item)}
                                // isDragging={snapshot.isDragging}
                              >
                                {title}
                                <span className={cls('list-item-extra')}>
                                  <Dropdown trigger={['click']} overlay={this.getMenus(item)}>
                                    <span className={cls('icon-wrapper')}>
                                      <ExtIcon
                                        type="setting"
                                        tooltip={{ title: '表单项配置' }}
                                        antd
                                      />
                                    </span>
                                  </Dropdown>
                                  <Popconfirm
                                    title="删除后不能恢复，确认删除吗？"
                                    placement="rightTop"
                                    cancelText="否"
                                    okText="是"
                                    onConfirm={() => this.handleDelFormItem(item)}
                                  >
                                    <span className={cls('icon-wrapper')}>
                                      <ExtIcon
                                        type="delete"
                                        className="del"
                                        tooltip={{ title: '删除' }}
                                        antd
                                      />
                                    </span>
                                  </Popconfirm>
                                </span>
                              </li>
                            )}
                          </Draggable>
                        );
                      })
                    ) : (
                      <Empty style={{ marginTop: 150 }} description={<span>暂无配置表单元素</span>}>
                        <Button type="primary" onClick={this.toggoleShowUnAssign}>
                          去配置
                        </Button>
                      </Empty>
                    )}
                  </ScrollBar>
                </ul>
              )}
            </Droppable>
            <div
              className={cls({
                'un-assigned-wrapper': true,
                hide_ele: !showUnAssign,
              })}
            >
              <ul className={cls('list-items')}>
                <ScrollBar>
                  {fieldLists
                    .filter(it => !formItems.some(itc => itc[0].code === it.code))
                    .map(item => {
                      const { code, name } = item;
                      return (
                        <li key={code} className={cls('list-item')}>
                          {name}
                          <span className={cls('list-item-extra')}>
                            <ExtIcon
                              type="plus"
                              tooltip={{ title: '添加' }}
                              onClick={() => this.handleAddFormItem(item)}
                              antd
                            />
                          </span>
                        </li>
                      );
                    })}
                </ScrollBar>
              </ul>
            </div>
          </div>
          {editData ? <EditDrawer key={optKey} {...this.getEditModalProps()} /> : null}
        </div>
      </DragDropContext>
    );
  }
}

export default FormEleCfg;
