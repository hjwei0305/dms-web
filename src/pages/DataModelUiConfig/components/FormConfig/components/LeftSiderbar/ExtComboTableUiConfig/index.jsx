import React, { Component } from 'react';
import cls from 'classnames';
// import { cloneDeep, } from 'lodahs';
import ColumnLayout from '@/components/Layout/ColumnLayout';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ScrollBar, ExtIcon } from 'suid';
import { getPropertiesByCode } from '@/pages/DataModelUiConfig/service';
import EditPopover from './EditPopover';

import styles from './index.less';

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
    console.log('ExtComboTableUiConfig -> result', result);
    // const { destination, source } = result;
    // const { onFormItemChange, uiConfig } = this.props;
    // const { formItems } = uiConfig || {};
    // const tempFormItems = formItems ? cloneDeep(formItems) : [];
    // if (destination && source) {
    //   const arrItem = tempFormItems[destination.index];
    //   tempFormItems[destination.index] = tempFormItems[source.index];
    //   tempFormItems[source.index] = arrItem;
    //   if (onFormItemChange) {
    //     onFormItemChange(tempFormItems);
    //   }
    // }
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
        <ColumnLayout
          className={cls(styles['ext-combo-ui-config'])}
          layout={[12, 12]}
          title={['可分配列', '已分配列']}
          gutter={4}
        >
          <ul className={cls('list-items')} slot="left">
            <ScrollBar>
              {fieldLists
                .filter(it => !uiCfgItems.some(itc => itc.code === it.code))
                .map(item => {
                  const { code, name } = item;
                  return (
                    <li key={code} className={cls('list-item')}>
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
          <div slot="right" style={{ height: '100%' }}>
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
                                <span className={cls('icon-wrapper')}>
                                  <ExtIcon
                                    type="delete"
                                    className="del"
                                    tooltip={{ title: '删除' }}
                                    onClick={() => this.handleDelCfgItem(item)}
                                    antd
                                  />
                                </span>
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

export default ExtComboTableUiConfig;
