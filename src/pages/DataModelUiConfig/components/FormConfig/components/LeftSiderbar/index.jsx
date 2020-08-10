import React, { Component } from 'react';
import cls from 'classnames';
import { cloneDeep, get } from 'lodash';
import { ScrollBar, ExtIcon } from 'suid';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getDataModelFields } from '@/pages/DataModelUiConfig/service';
import EditModal from './EditModal';

import styles from './index.less';

class LeftSiderbar extends Component {
  state = {
    fieldLists: [],
    showUnAssign: false,
    editData: null,
  };

  componentDidMount() {
    this.getDataModelFields().then(result => {
      const { success, data } = result;
      if (success) {
        this.setState({
          fieldLists: data,
        });
      }
    });
  }

  getDataModelFields = () => {
    const { dataModel } = this.props;

    return getDataModelFields({
      modelId: dataModel.id,
    });
  };

  toggoleShowUnAssign = () => {
    const { showUnAssign } = this.state;
    this.setState({
      showUnAssign: !showUnAssign,
    });
  };

  handleAddFormItem = item => {
    const { fieldName, remark } = item;
    const { onFormItemChange, uiConfig } = this.props;
    const { formItems } = uiConfig || {};
    const tempFormItems = formItems ? cloneDeep(formItems) : [];
    tempFormItems.push([
      fieldName,
      {
        title: remark,
        // type: 'string'
        'ui:widget': 'ExtInput',
      },
    ]);
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

  handleToggoleEditModal = editData => {
    this.setState({
      editData,
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

  getEditModalProps = () => {
    const { editData } = this.state;

    return {
      editData,
      onCancel: this.handleCancel,
      onSave: this.handleEditFormItem,
    };
  };

  render() {
    const { fieldLists, showUnAssign, editData } = this.state;
    const { uiConfig } = this.props;
    const formItems = get(uiConfig, 'formItems', []);

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className={cls(styles['left-sider-bar'])}>
          <div className={cls('title')}>
            {showUnAssign ? (
              <>
                <ExtIcon
                  type="left"
                  tooltip={{ title: '返回' }}
                  onClick={this.toggoleShowUnAssign}
                  antd
                />
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
            <ScrollBar>
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
                    {formItems.map((item, index) => {
                      const [fieldName, { title }] = item;
                      // fieldName
                      return (
                        <Draggable
                          draggableId={fieldName}
                          index={index}
                          key={fieldName}
                          // isDragDisabled={isDragDisabled}
                        >
                          {(dragprovided, snapshot) => (
                            <li
                              className={cls('list-item')}
                              {...dragprovided.draggableProps}
                              {...dragprovided.dragHandleProps}
                              ref={dragprovided.innerRef}
                              isdragging={snapshot.isDragging}
                              // isDragging={snapshot.isDragging}
                            >
                              {title}
                              <span className={cls('list-item-extra')}>
                                <span className={cls('icon-wrapper')}>
                                  <ExtIcon
                                    type="edit"
                                    tooltip={{ title: '编辑' }}
                                    onClick={() => this.handleToggoleEditModal(item)}
                                    antd
                                  />
                                </span>
                                <span className={cls('icon-wrapper')}>
                                  <ExtIcon
                                    type="delete"
                                    className="del"
                                    tooltip={{ title: '删除' }}
                                    onClick={() => this.handleDelFormItem(item)}
                                    antd
                                  />
                                </span>
                              </span>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
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
                  {fieldLists
                    .filter(it => !formItems.some(itc => itc[0] === it.fieldName))
                    .map(item => {
                      const { id, remark } = item;
                      // fieldName
                      return (
                        <li key={id} className={cls('list-item')}>
                          {remark}
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
                </ul>
              </div>
            </ScrollBar>
          </div>
          {editData ? <EditModal {...this.getEditModalProps()} /> : null}
        </div>
      </DragDropContext>
    );
  }
}

export default LeftSiderbar;
