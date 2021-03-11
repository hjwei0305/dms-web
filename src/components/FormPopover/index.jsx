import React, { PureComponent } from 'react';
import { Form, Popover, Button, Row, PageHeader } from 'antd';

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
class FormPopover extends PureComponent {
  state = {
    visible: false,
  };

  handleSave = () => {
    const { form, onOk, extraParams } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, extraParams, formData);
      onOk(params, this.handleShowChange);
    });
  };

  handleShowChange = visible => {
    this.setState({
      visible,
    });
  };

  getPopoverContent = () => {
    const { form, width = 400, confirmLoading, renderFormItems, title, subTitle } = this.props;

    return (
      <div
        style={{
          width,
          overflow: 'hidden',
        }}
      >
        <PageHeader title={title} subTitle={subTitle} />
        <Form {...formItemLayout} layout="horizontal">
          {renderFormItems && renderFormItems(form, FormItem)}
          <Row
            style={{
              float: 'right',
            }}
          >
            <Button onClick={this.handleSave} loading={confirmLoading} type="primary">
              确定
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

export default FormPopover;
