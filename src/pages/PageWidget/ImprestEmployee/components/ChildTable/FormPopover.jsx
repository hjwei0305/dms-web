import React, { PureComponent } from 'react';
import { Form, Input, Switch, Popover, Button, Row, PageHeader } from 'antd';
import { ComboGrid } from 'suid';
import { get } from 'lodash';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
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

  getDsComboGridProps = () => {
    const { form, parentData } = this.props;

    return {
      form,
      name: 'dataName',
      store: {
        type: 'GET',
        autoLoad: false,
        url: `${MDMSCONTEXT}/appSubscription/getUnassigned?appCode=${parentData.code}`,
      },
      columns: [
        {
          title: '代码',
          width: 120,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 160,
          dataIndex: 'name',
        },
        {
          title: '描述',
          width: 200,
          dataIndex: 'remark',
        },
      ],
      rowKey: 'code',
      reader: {
        name: 'name',
        field: ['code'],
      },
      field: ['dataCode'],
    };
  };

  getPopoverContent = () => {
    const { form, editData, isSaving, parentData } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

    return (
      <div
        style={{
          width: 400,
          overflow: 'hidden',
        }}
      >
        <PageHeader title="公司" subTitle={title} />
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="备用金员工Id" hidden>
            {getFieldDecorator('imprestEmployeeId', {
              initialValue: get(parentData, 'id', ''),
            })(<Input />)}
          </FormItem>
          <FormItem label="ERP公司代码">
            {getFieldDecorator('erpCorporationCode', {
              initialValue: get(editData, 'erpCorporationCode', ''),
              rules: [
                {
                  required: true,
                  message: '请输入ERP公司代码',
                },
                {
                  max: 10,
                  message: 'ERP公司代码长度不能超过10',
                },
              ],
            })(<Input disabled={!!editData} />)}
          </FormItem>
          <FormItem label="统驭科目代码">
            {getFieldDecorator('accountCode', {
              initialValue: get(editData, 'accountCode', ''),
              rules: [
                {
                  max: 10,
                  message: '统驭科目代码长度不能超过10',
                },
              ],
            })(<Input />)}
          </FormItem>
          {/* <FormItem label="ERP公司代码">
            {getFieldDecorator('erpCorporationCode', {
              initialValue: get(editData, 'erpCorporationCode', ''),
              rules: [
                {
                  required: true,
                  message: '请选择订阅数据',
                },
              ],
            })(<ComboGrid disabled={!!editData} {...this.getDsComboGridProps()} />)}
          </FormItem> */}
          <FormItem label="支付条款代码">
            {getFieldDecorator('paymentTermCode', {
              initialValue: get(editData, 'paymentTermCode', ''),
              rules: [
                {
                  max: 4,
                  message: '字段状态组长度不能超过4',
                },
              ],
            })(<Input />)}
          </FormItem>
          {/* <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: get(editData, 'remark'),
            })(<Input.TextArea />)}
          </FormItem> */}
          <FormItem label="支付冻结">
            {getFieldDecorator('payFrozen', {
              valuePropName: 'checked',
              initialValue: get(editData, 'payFrozen'),
            })(<Switch />)}
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

export default FormPopover;
