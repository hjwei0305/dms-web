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
          <FormItem label="允许创建根结点" {...colFormItemLayout}>
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
        </Form>
      </Card>
    );
  }
}

export default RightSiderbar;
