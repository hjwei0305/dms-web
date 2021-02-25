import React, { PureComponent } from 'react';
import { Form, Input, Switch, Popover, Button, Row, PageHeader } from 'antd';
import { get } from 'lodash';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  state = {
    visible: false,
  };

  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      onSave(params, this.handleShowChange);
    });
  };

  handleShowChange = visible => {
    this.setState({
      visible,
    });
  };

  getPopoverContent = () => {
    const { form, editData, isSaving } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

    return (
      <div
        style={{
          width: 400,
          overflow: 'hidden',
        }}
      >
        <PageHeader title="应用模块" subTitle={title} />
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="应用代码">
            {getFieldDecorator('code', {
              initialValue: get(editData, 'code'),
              rules: [
                {
                  required: true,
                  message: '请输入应用代码',
                },
              ],
            })(<Input disabled={!!editData} />)}
          </FormItem>
          <FormItem label="应用名称">
            {getFieldDecorator('name', {
              initialValue: get(editData, 'name'),
              rules: [
                {
                  required: true,
                  message: '请输入应用名称',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="应用描述">
            {getFieldDecorator('remark', {
              initialValue: get(editData, 'remark'),
            })(<Input.TextArea />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              valuePropName: 'checked',
              initialValue: get(editData, 'frozen'),
            })(<Switch />)}
          </FormItem>
          <Row
            style={{
              float: 'right',
            }}
          >
            <Button onClick={this.handleSave} loading={isSaving} type="primary">
              保存
            </Button>
          </Row>
        </Form>
      </div>
    );
  };

  render() {
    const { children } = this.props;
    const { visible } = this.state;

    return (
      <Popover
        placement="rightTop"
        content={this.getPopoverContent()}
        onVisibleChange={v => this.handleShowChange(v)}
        trigger="click"
        destroyTooltipOnHide
        visible={visible}
      >
        {children}
      </Popover>
    );
  }
}

export default FormModal;
