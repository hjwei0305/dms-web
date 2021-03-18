import React, { Component } from 'react';
import cls from 'classnames';
import { Popconfirm } from 'antd';
import { cloneDeep } from 'lodash';
// import ColumnLayout from '@/components/Layout/ColumnLayout';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ScrollBar, ExtIcon, ProLayout } from 'suid';
import { getPropertiesByCode } from '@/pages/DataModelUiConfig/service';
import EditPopover from './EditPopover';

import styles from './index.less';

const { Header, Content } = ProLayout;

class ExtComboTableUiConfig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldLists: [],
      uiCfgItems: props.value,
    };
  }

  componentDidMount() {
    this.getPropertiesByCode();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dataModelCode !== this.props.dataModelCode) {
      this.getPropertiesByCode();
    }
  }

  handleSave = item => {
    const { onChange } = this.props;
    const { uiCfgItems } = this.state;

    const tempUiCfgItems = uiCfgItems.map(it => {
      if (it.code === item.code) {
        return item;
      }
      return it;
    });

    this.setState(
      {
        uiCfgItems: tempUiCfgItems,
      },
      () => {
        if (onChange) {
          onChange(tempUiCfgItems);
        }
      },
    );
  };

  // toggleVisible = code => {
  //   const { editPopoverVisbles } = this.state;

  //   this.setState({
  //     editPopoverVisbles: {
  //       ...editPopoverVisbles,
  //       [code]: !editPopoverVisbles[code],
  //     },
  //   });
  // }

  handleAddCfgItem = item => {
    const { uiCfgItems } = this.state;

    this.setState({
      uiCfgItems: uiCfgItems.concat(item),
    });
  };

  handleDelCfgItem = item => {
    const { uiCfgItems } = this.state;

    this.setState({
      uiCfgItems: uiCfgItems.filter(it => it.code !== item.code),
    });
  };

  onDragEnd = result => {
    const { onChange } = this.props;
    const { destination, source } = result;
    const { uiCfgItems } = this.state;
    const tempUiCfgItems = uiCfgItems ? cloneDeep(uiCfgItems) : [];
    if (destination && source) {
      const arrItem = tempUiCfgItems[destination.index];
      tempUiCfgItems[destination.index] = tempUiCfgItems[source.index];
      tempUiCfgItems[source.index] = arrItem;
      this.setState(
        {
          uiCfgItems: tempUiCfgItems,
        },
        () => {
          if (onChange) {
            onChange(tempUiCfgItems);
          }
        },
      );
    }
  };

  getPropertiesByCode = () => {
    const { dataModelCode } = this.props;

    return getPropertiesByCode({
      code: dataModelCode,
    }).then(result => {
      const { success, data } = result;
      if (success) {
        this.setState({
          fieldLists: data || [],
        });
      }
    });
  };

  render() {
    const { fieldLists, uiCfgItems } = this.state;
    const { mapFieldLists } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <ProLayout className={cls(styles['ext-combo-ui-config'])}>
          <ProLayout style={{ marginRight: 4 }}>
            <Header size="small" title="可分配列" />
            <Content>
              <ul className={cls('list-items')}>
                <ScrollBar>
                  {fieldLists
                    .filter(it => !uiCfgItems.some(itc => itc.code === it.code))
                    .map(item => {
                      const { code, name } = item;
                      return (
                        <li key={code} className={cls('list-item', 'no-move')}>
                          {name}
                          <span className={cls('list-item-extra')}>
                            <ExtIcon
                              type="plus"
                              tooltip={{ title: '添加' }}
                              onClick={() => this.handleAddCfgItem(item)}
                              antd
                            />
                          </span>
                        </li>
                      );
                    })}
                </ScrollBar>
              </ul>
            </Content>
          </ProLayout>
          <ProLayout>
            <Header size="small" title="已分配列" />
            <Content>
              <div style={{ height: '100%' }}>
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
                        {uiCfgItems.map((item, index) => {
                          const { code, name } = item;
                          // fieldName
                          return (
                            <Draggable
                              draggableId={code}
                              index={index}
                              key={code}
                              // isDragDisabled={isDragDisabled}
                            >
                              {(dragprovided, snapshot) => (
                                <li
                                  className={cls('list-item')}
                                  {...dragprovided.draggableProps}
                                  {...dragprovided.dragHandleProps}
                                  ref={dragprovided.innerRef}
                                  isdragging={snapshot.isDragging}
                                  title={name}
                                  // isDragging={snapshot.isDragging}
                                >
                                  {name}
                                  <span className={cls('list-item-extra')}>
                                    <EditPopover
                                      mapFieldLists={mapFieldLists}
                                      editData={item}
                                      // visible={editPopoverVisbles[code]}
                                      onSave={this.handleSave}
                                    >
                                      <span className={cls('icon-wrapper', 'icon-edit')}>
                                        <ExtIcon type="edit" tooltip={{ title: '编辑' }} antd />
                                      </span>
                                    </EditPopover>
                                    <Popconfirm
                                      title="删除后不能恢复，确认删除吗？"
                                      placement="rightTop"
                                      cancelText="否"
                                      okText="是"
                                      onConfirm={() => this.handleDelCfgItem(item)}
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
                                    {/* <span className={cls('icon-wrapper')}>
                                      <ExtIcon
                                        type="delete"
                                        className="del"
                                        tooltip={{ title: '删除' }}
                                        onClick={() => this.handleDelCfgItem(item)}
                                        antd
                                      />
                                    </span> */}
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
            </Content>
          </ProLayout>
        </ProLayout>
      </DragDropContext>
    );
  }
}

export default ExtComboTableUiConfig;
