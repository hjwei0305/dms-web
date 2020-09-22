import React, { Component } from 'react';
import cls from 'classnames';
import { Popconfirm } from 'antd';
import { cloneDeep } from 'lodash';
import { ScrollBar, ExtIcon } from 'suid';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import ColumnLayout from '@/components/Layout/ColumnLayout';

import styles from './index.less';

class ExtTransfer extends Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      assignItems: value || [],
    };
  }

  handleAddItem = item => {
    const { onChange } = this.props;
    const { assignItems } = this.state;
    const tempAssignItems = assignItems.concat(item);
    this.setState(
      {
        assignItems: tempAssignItems,
      },
      () => {
        if (onChange) {
          onChange(tempAssignItems);
        }
      },
    );
  };

  handleDelItem = item => {
    const { onChange } = this.props;
    const { assignItems } = this.state;
    const tempAssignItems = assignItems.filter(it => it.code !== item.code);
    this.setState(
      {
        assignItems: tempAssignItems,
      },
      () => {
        if (onChange) {
          onChange(tempAssignItems);
        }
      },
    );
  };

  onDragEnd = result => {
    const { onChange } = this.props;
    const { destination, source } = result;
    const { assignItems } = this.state;
    const tempItems = assignItems ? cloneDeep(assignItems) : [];
    if (destination && source) {
      const arrItem = tempItems[destination.index];
      tempItems[destination.index] = tempItems[source.index];
      tempItems[source.index] = arrItem;
      this.setState(
        {
          assignItems: tempItems,
        },
        () => {
          if (onChange) {
            onChange(tempItems);
          }
        },
      );
    }
  };

  render() {
    const { assignItems } = this.state;
    const { itemList = [] } = this.props;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <ColumnLayout
          className={cls(styles['ext-transfer'])}
          layout={[12, 12]}
          title={[
            `可分配项【${itemList.length - assignItems.length}】`,
            `已分配项【${assignItems.length}】`,
          ]}
          gutter={4}
        >
          <ul className={cls('list-items')} slot="left">
            <ScrollBar>
              {itemList
                .filter(it => !assignItems.some(itc => itc.code === it.code))
                .map(item => {
                  const { code, name } = item;
                  return (
                    <li key={code} className={cls('list-item', 'no-move')}>
                      {name}
                      <span className={cls('list-item-extra')}>
                        <span
                          className={cls('icon-wrapper')}
                          onClick={() => this.handleAddItem(item)}
                        >
                          <ExtIcon type="plus" tooltip={{ title: '添加' }} antd />
                        </span>
                      </span>
                    </li>
                  );
                })}
            </ScrollBar>
          </ul>
          <div slot="right" style={{ height: '100%' }}>
            <Droppable droppableId="board" type="COLUMN">
              {provided => (
                <ul
                  className={cls('list-items')}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <ScrollBar>
                    {assignItems.map((item, index) => {
                      const { code, name } = item;
                      return (
                        <Draggable draggableId={code} index={index} key={code}>
                          {(dragprovided, snapshot) => (
                            <li
                              className={cls('list-item')}
                              {...dragprovided.draggableProps}
                              {...dragprovided.dragHandleProps}
                              ref={dragprovided.innerRef}
                              isdragging={snapshot.isDragging}
                              title={name}
                            >
                              {name}
                              <span className={cls('list-item-extra')}>
                                <Popconfirm
                                  title="删除后不能恢复，确认删除吗？"
                                  placement="rightTop"
                                  cancelText="否"
                                  okText="是"
                                  onConfirm={() => this.handleDelItem(item)}
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
                    })}
                  </ScrollBar>
                </ul>
              )}
            </Droppable>
          </div>
        </ColumnLayout>
      </DragDropContext>
    );
  }
}

export default ExtTransfer;
