import React, { Component } from 'react';
import cls from 'classnames';
import { cloneDeep, get } from 'lodash';
import { Popconfirm } from 'antd';
import { ScrollBar, ExtIcon } from 'suid';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getPropertiesByCode } from '@/pages/DataModelUiConfig/service';
import EditPopover from './EditPopover';

import styles from './index.less';

class LeftSiderbar extends Component {
  state = {
    fieldLists: [],
    showUnAssign: false,
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

  handleAddExportColItem = item => {
    const { onItemChange, uiConfig } = this.props;
    const { code, name } = item;
    const exportColItems = get(uiConfig, 'colItems', []);
    const tempExportColItems = exportColItems ? cloneDeep(exportColItems) : [];
    const tempExportColItem = [
      {
        code,
        name,
      },
      {
        title: name,
      },
    ];
    tempExportColItems.push(tempExportColItem);
    if (onItemChange) {
      onItemChange(tempExportColItems);
    }
  };

  handleDelItem = item => {
    const { onDelItem } = this.props;
    if (onDelItem) {
      onDelItem(item);
    }
  };

  handleEditItem = item => {
    const { onEditItem } = this.props;
    if (onEditItem) {
      onEditItem(cloneDeep(item));
    }
  };

  onDragEnd = result => {
    const { destination, source } = result;
    const { onItemChange, uiConfig } = this.props;
    const exportColItems = get(uiConfig, 'colItems', []);
    const tempExportColItems = exportColItems ? cloneDeep(exportColItems) : [];
    if (destination && source) {
      const arrItem = tempExportColItems[destination.index];
      tempExportColItems[destination.index] = tempExportColItems[source.index];
      tempExportColItems[source.index] = arrItem;
      if (onItemChange) {
        onItemChange(tempExportColItems);
      }
    }
  };

  render() {
    const { fieldLists, showUnAssign } = this.state;
    const { uiConfig } = this.props;
    const colItems = get(uiConfig, 'colItems', []);

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
                可配导出列
              </>
            ) : (
              '已配导出列'
            )}
            {showUnAssign ? null : (
              <span className={cls('title-extra')}>
                <ExtIcon
                  type="plus"
                  tooltip={{ title: '添加导出列' }}
                  onClick={this.toggoleShowUnAssign}
                  antd
                />
              </span>
            )}
          </div>
          <div className={cls('content')}>
            <Droppable droppableId="board" type="COLUMN">
              {provided => (
                <ul
                  className={cls('list-items')}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <ScrollBar>
                    {colItems.map((item, index) => {
                      const [{ code, name }] = item;
                      return (
                        <Draggable draggableId={code} index={index} key={code}>
                          {dragprovided => (
                            <li
                              className={cls('list-item')}
                              {...dragprovided.draggableProps}
                              {...dragprovided.dragHandleProps}
                              ref={dragprovided.innerRef}
                              title={name}
                            >
                              {name}
                              <span className={cls('list-item-extra')}>
                                <EditPopover editData={item} onSave={this.handleEditItem}>
                                  <span className={cls('icon-wrapper')}>
                                    <ExtIcon type="setting" tooltip={{ title: '配置' }} antd />
                                  </span>
                                </EditPopover>
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
            <div
              className={cls({
                'un-assigned-wrapper': true,
                hide_ele: !showUnAssign,
              })}
            >
              <ul className={cls('list-items')}>
                <ScrollBar>
                  {fieldLists
                    .filter(it => !colItems.some(itc => itc[0].code === it.code))
                    .map(item => {
                      const { code, name } = item;
                      return (
                        <li key={code} className={cls('list-item')}>
                          {name}
                          <span className={cls('list-item-extra')}>
                            <ExtIcon
                              type="plus"
                              tooltip={{ title: '添加' }}
                              onClick={() => this.handleAddExportColItem(item)}
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
        </div>
      </DragDropContext>
    );
  }
}

export default LeftSiderbar;
