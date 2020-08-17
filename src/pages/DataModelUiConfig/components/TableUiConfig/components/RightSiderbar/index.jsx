import React from 'react';
import { Form, Card, Switch } from 'antd';
import { ExtIcon } from 'suid';
import { get } from 'lodash';
import cls from 'classnames';

import styles from './index.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const colFormItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class RightSiderbar extends React.Component {
  handleSave = () => {
    const { form, onEditTable, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onEditTable) {
        onEditTable({ ...editData, ...formData });
      }
    });
  };

  getCardExtra = () => {
    return (
      <span className={cls('icon-wrapper')}>
        <ExtIcon
          type="save"
          style={{ fontSize: '20px' }}
          tooltip={{ title: '保存' }}
          onClick={this.handleSave}
          antd
        />
      </span>
    );
    // <ExtIcon type="save" tooltip={{ title: '保存' }} onClick={this.handleSave} antd />;
  };

  render() {
    const { editData, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Card
        extra={this.getCardExtra()}
        className={cls(styles['right-sider-bar'])}
        bordered={false}
        title="表格属性"
      >
        <Form {...formItemLayout}>
          {/* <FormItem label="请求类型" {...colFormItemLayout}>
            {getFieldDecorator('store.type', {
              initialValue: get(editData, 'store.type'),
              rules: [
                {
                  required: true,
                  message: '请求类型不能为空',
                },
              ],
            })(
              <Select>
                <Select.Option value="GET">GET</Select.Option>
                <Select.Option value="POST">POST</Select.Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="请求地址" {...colFormItemLayout}>
            {getFieldDecorator('store.url', {
              initialValue: get(editData, 'store.url'),
              rules: [
                {
                  required: true,
                  message: '请求地址不能为空',
                },
              ],
            })(<Input />)}
          </FormItem> */}
          <FormItem label="边框" {...colFormItemLayout}>
            {getFieldDecorator('bordered', {
              valuePropName: 'checked',
              initialValue: get(editData, 'bordered'),
            })(
              <Switch
                onChange={bordered => {
                  const { onEditTable } = this.props;
                  if (onEditTable) {
                    onEditTable({
                      bordered,
                    });
                  }
                }}
              />,
            )}
          </FormItem>
          <FormItem label="自定义列" {...colFormItemLayout}>
            {getFieldDecorator('allowCustomColumns', {
              valuePropName: 'checked',
              initialValue: get(editData, 'allowCustomColumns'),
            })(
              <Switch
                onChange={allowCustomColumns => {
                  const { onEditTable } = this.props;
                  if (onEditTable) {
                    onEditTable({
                      allowCustomColumns,
                    });
                  }
                }}
              />,
            )}
          </FormItem>
          <FormItem label="查询文本提示" {...colFormItemLayout}>
            {getFieldDecorator('showSearchTooltip', {
              valuePropName: 'checked',
              initialValue: get(editData, 'showSearchTooltip'),
            })(
              <Switch
                onChange={showSearchTooltip => {
                  const { onEditTable } = this.props;
                  if (onEditTable) {
                    onEditTable({
                      showSearchTooltip,
                    });
                  }
                }}
              />,
            )}
          </FormItem>
          <FormItem style={{ display: 'none' }} {...colFormItemLayout}>
            {getFieldDecorator('remotePaging', {
              valuePropName: 'checked',
              initialValue: get(editData, 'remotePaging'),
            })(<Switch />)}
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default RightSiderbar;
