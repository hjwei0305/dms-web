import React from 'react';
import { Form, Card, Select } from 'antd';
import { ExtIcon } from 'suid';
import { get } from 'lodash';
import cls from 'classnames';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
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
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};

@Form.create()
class TreeCfg extends React.Component {
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        onSave({ ...editData, ...formData });
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
        title="树属性"
      >
        <Form {...formItemLayout}>
          {/* <FormItem label="允许创建根结点" {...colFormItemLayout}>
            {getFieldDecorator('allowCreateRoot', {
              valuePropName: 'checked',
              initialValue: get(editData, 'allowCreateRoot'),
            })(
              <Switch
                onChange={allowCreateRoot => {
                  const { onEditTable } = this.props;
                  if (onEditTable) {
                    onEditTable({
                      allowCreateRoot,
                    });
                  }
                }}
              />,
            )}
          </FormItem> */}
          <FormItem label="详情列配置" {...colFormItemLayout}>
            {getFieldDecorator('column', {
              initialValue: get(editData, 'column', 1),
              rules: [
                {
                  required: true,
                  message: '列配置不能为空',
                },
              ],
            })(
              <Select
                style={{ marginRight: 8 }}
                onChange={column => {
                  const { onEditTable } = this.props;
                  if (onEditTable) {
                    onEditTable({
                      column,
                    });
                  }
                }}
              >
                <Option value={1}>一行一列</Option>
                <Option value={2}>一行二列</Option>
                <Option value={3}>一行三列</Option>
              </Select>,
            )}
          </FormItem>
          {/* <FormItem label="查询文本提示" {...colFormItemLayout}>
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
          </FormItem> */}
        </Form>
      </Card>
    );
  }
}

export default TreeCfg;
