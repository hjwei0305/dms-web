import React, { Component } from 'react';
import cls from 'classnames';
import { cloneDeep, get } from 'lodash';
import { Popconfirm, Form, Select, Slider } from 'antd';
import { ScrollBar, ExtIcon } from 'suid';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getPropertiesByCode } from '@/pages/DataModelUiConfig/service';
import ColumnLayout from '@/components/Layout/ColumnLayout';
// import EditModal from './EditModal';
import EditDrawer from './EditDrawer';

import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

@Form.create()
class LeftSiderbar extends Component {
  state = {
    fieldLists: [],
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

  handleSave = () => {
    const { onSave } = this.props;
    if (onSave) {
      onSave();
    }
    // const { form, editData, onSave } = this.props;
    // form.validateFields((err, formData) => {
    //   if (err) {
    //     return;
    //   }
    //   if (onSave) {
    //     onSave({ ...editData, ...formData });
    //   }
    // });
  };

  handleAddFormItem = item => {
    const { onFormItemChange, uiConfig } = this.props;
    const { code, name } = item;
    const formItems = get(uiConfig, 'filterFormCfg.formItems', []);
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

  getCardExtra = () => {
    return (
      <span className={cls('icon-wrapper', 'title-extra')} onClick={this.handleSave}>
        <ExtIcon type="save" style={{ fontSize: '20px' }} tooltip={{ title: '保存' }} antd />
      </span>
    );
  };

  getEditModalProps = () => {
    const { editData, fieldLists } = this.state;

    return {
      editData,
      optKey: 1,
      fieldLists,
      onCancel: this.handleCancel,
      onSave: this.handleEditFormItem,
    };
  };

  updateUiConfig = uiConfig => {
    const { onUiCfgChange } = this.props;

    if (onUiCfgChange) {
      onUiCfgChange(uiConfig);
    }
  };

  render() {
    const { fieldLists, editData } = this.state;
    const { uiConfig, form } = this.props;
    const { getFieldDecorator } = form;
    const formItems = get(uiConfig, 'filterFormCfg.formItems', []);

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className={cls(styles['left-sider-bar'])}>
          <div className={cls('title')}>
            导出过滤表单配置
            {this.getCardExtra()}
          </div>
          <div className={cls('form-wrapper')}>
            <Form {...formItemLayout}>
              <FormItem label="整体布局">
                {getFieldDecorator('column', {
                  initialValue: get(editData, 'column', 1),
                  rules: [
                    {
                      required: true,
                      message: '整体布局不能为空',
                    },
                  ],
                })(
                  <Select
                    style={{ marginRight: 8 }}
                    onChange={column => {
                      this.updateUiConfig({ column });
                    }}
                  >
                    <Option value={1}>一行一列</Option>
                    <Option value={2}>一行二列</Option>
                    <Option value={3}>一行三列</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem label="展示方式">
                {getFieldDecorator('displayType', {
                  initialValue: get(editData, 'displayType', 'column'),
                  rules: [
                    {
                      required: true,
                      message: '展示方式不能为空',
                    },
                  ],
                })(
                  <Select
                    onChange={displayType => {
                      this.updateUiConfig({ displayType });
                    }}
                  >
                    <Option value="column">上下排列</Option>
                    <Option value="row">左右排列</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem label="标签宽度">
                {getFieldDecorator('labelWidth', {
                  initialValue: get(editData, 'labelWidth', 80),
                })(
                  <Slider
                    max={200}
                    min={20}
                    onChange={labelWidth => this.updateUiConfig({ labelWidth })}
                  />,
                )}
              </FormItem>
            </Form>
          </div>
          <div className={cls('content')}>
            <ColumnLayout layout={[12, 12]} title={['已配表单项', '未配置表单项']} gutter={4}>
              <div className={cls('assigned-wrapper')} slot="left">
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
                        {formItems.map((item, index) => {
                          const [{ code: fieldName, name: title }] = item;
                          return (
                            <Draggable draggableId={fieldName} index={index} key={fieldName}>
                              {dragprovided => (
                                <li
                                  className={cls('list-item')}
                                  {...dragprovided.draggableProps}
                                  {...dragprovided.dragHandleProps}
                                  ref={dragprovided.innerRef}
                                  title={title}
                                >
                                  {title}
                                  <span className={cls('list-item-extra')}>
                                    <span
                                      className={cls('icon-wrapper')}
                                      onClick={() => this.handleToggoleEditModal(item)}
                                    >
                                      <ExtIcon type="setting" tooltip={{ title: '配置' }} antd />
                                    </span>
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
                        })}
                      </ScrollBar>
                    </ul>
                  )}
                </Droppable>
              </div>
              <div
                className={cls({
                  'un-assigned-wrapper': true,
                })}
                slot="right"
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
            </ColumnLayout>
          </div>
          {editData ? <EditDrawer {...this.getEditModalProps()} /> : null}
        </div>
      </DragDropContext>
    );
  }
}

export default LeftSiderbar;
