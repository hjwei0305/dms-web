import React, { Component } from 'react';
import cls from 'classnames';
import { cloneDeep } from 'lodash';
import { ScrollBar, ExtIcon } from 'suid';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getPropertiesByCode } from '@/pages/DataModelUiConfig/service';
import EditModal from './EditModal';

import styles from './index.less';

class LeftSiderbar extends Component {
  state = {
    fieldLists: [],
    showUnAssign: false,
    editData: null,
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

  handleAddDetailField = item => {
    const { onFieldChange, treeUiConfig } = this.props;
    const { detailFields } = treeUiConfig || {};
    const tempDetailFields = detailFields ? cloneDeep(detailFields) : [];
    tempDetailFields.push(item);
    if (onFieldChange) {
      onFieldChange(tempDetailFields);
    }
  };

  handleDelField = item => {
    const { onDelField } = this.props;
    if (onDelField) {
      onDelField(item);
    }
  };

  handleToggoleEditModal = editData => {
    this.setState({
      editData,
    });
  };

  handleEditField = item => {
    const { onEditField } = this.props;
    if (onEditField) {
      onEditField(cloneDeep(item));
      this.setState({
        editData: null,
      });
    }
  };

  onDragEnd = result => {
    const { destination, source } = result;
    const { onFieldChange, treeUiConfig } = this.props;
    const { detailFields } = treeUiConfig || {};
    const tempDetailFields = detailFields ? cloneDeep(detailFields) : [];
    if (destination && source) {
      const arrItem = tempDetailFields[destination.index];
      tempDetailFields[destination.index] = tempDetailFields[source.index];
      tempDetailFields[source.index] = arrItem;
      if (onFieldChange) {
        onFieldChange(tempDetailFields);
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
      onSave: this.handleEditField,
    };
  };

  render() {
    const { fieldLists, showUnAssign, editData } = this.state;
    const { treeUiConfig } = this.props;
    const { detailFields = [] } = treeUiConfig || {};

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
                可配字段
              </>
            ) : (
              '已配详情字段'
            )}
            {showUnAssign ? null : (
              <span className={cls('title-extra')}>
                <ExtIcon
                  type="plus"
                  tooltip={{ title: '添加列' }}
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
                    {detailFields.map((item, index) => {
                      const { code, name } = item;
                      // fieldName
                      return (
                        <Draggable
                          draggableId={code}
                          index={index}
                          key={code}
                          // isDragDisabled={isDragDisabled}
                        >
                          {dragprovided => (
                            <li
                              className={cls('list-item')}
                              {...dragprovided.draggableProps}
                              {...dragprovided.dragHandleProps}
                              ref={dragprovided.innerRef}
                              // isdragging={snapshot.isDragging}
                              title={name}
                              // isDragging={snapshot.isDragging}
                            >
                              {name}
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
                                    onClick={() => this.handleDelField(item)}
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
                    .filter(it => !detailFields.some(itc => itc.code === it.code))
                    .map(item => {
                      const { code, name } = item;
                      return (
                        <li key={code} className={cls('list-item')}>
                          {name}
                          <span className={cls('list-item-extra')}>
                            <ExtIcon
                              type="plus"
                              tooltip={{ title: '添加' }}
                              onClick={() => this.handleAddDetailField(item)}
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
