import React, { Component } from 'react';
import cls from 'classnames';
import { cloneDeep } from 'lodash';
import { Popconfirm, Empty, Button } from 'antd';
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

  handleAddCol = item => {
    const { code, name } = item;
    const { onColChange, tableUiConfig } = this.props;
    const { columns } = tableUiConfig || {};
    const tempColumns = columns ? cloneDeep(columns) : [];
    tempColumns.push({
      dataIndex: code,
      title: name,
      required: true,
      width: 120,
    });
    if (onColChange) {
      onColChange(tempColumns);
    }
  };

  handleDelCol = item => {
    const { onDelCol } = this.props;
    if (onDelCol) {
      onDelCol(item);
    }
  };

  handleToggoleEditModal = editData => {
    this.setState({
      editData,
    });
  };

  handleEditCol = item => {
    const { onEditCol } = this.props;
    if (onEditCol) {
      onEditCol(cloneDeep(item));
      this.setState({
        editData: null,
      });
    }
  };

  onDragEnd = result => {
    const { destination, source } = result;
    const { onColChange, tableUiConfig } = this.props;
    const { columns } = tableUiConfig || {};
    const tempColumns = columns ? cloneDeep(columns) : [];
    if (destination && source) {
      const arrItem = tempColumns[destination.index];
      tempColumns[destination.index] = tempColumns[source.index];
      tempColumns[source.index] = arrItem;
      if (onColChange) {
        onColChange(tempColumns);
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
      onSave: this.handleEditCol,
    };
  };

  render() {
    const { fieldLists, showUnAssign, editData } = this.state;
    const { tableUiConfig } = this.props;
    const { columns = [] } = tableUiConfig || {};

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
                可配置列
              </>
            ) : (
              '已配列'
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
                    {columns.length ? (
                      columns.map((item, index) => {
                        const { dataIndex, title } = item;
                        // fieldName
                        return (
                          <Draggable
                            draggableId={dataIndex}
                            index={index}
                            key={dataIndex}
                            // isDragDisabled={isDragDisabled}
                          >
                            {(dragprovided, snapshot) => (
                              <li
                                className={cls('list-item')}
                                {...dragprovided.draggableProps}
                                {...dragprovided.dragHandleProps}
                                ref={dragprovided.innerRef}
                                isdragging={snapshot.isDragging}
                                title={title}
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
                                  <Popconfirm
                                    title="删除后不能恢复，确认删除吗？"
                                    placement="rightTop"
                                    cancelText="否"
                                    okText="是"
                                    onConfirm={() => this.handleDelCol(item)}
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
                      <Empty style={{ marginTop: 150 }} description={<span>暂无配置表格列</span>}>
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
                    .filter(it => !columns.some(itc => itc.dataIndex === it.code))
                    .map(item => {
                      const { code, name } = item;
                      // fieldName
                      return (
                        <li key={code} className={cls('list-item')}>
                          {name}
                          <span className={cls('list-item-extra')}>
                            <ExtIcon
                              type="plus"
                              tooltip={{ title: '添加' }}
                              onClick={() => this.handleAddCol(item)}
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
          {editData ? <EditModal {...this.getEditModalProps()} /> : null}
        </div>
      </DragDropContext>
    );
  }
}

export default LeftSiderbar;
