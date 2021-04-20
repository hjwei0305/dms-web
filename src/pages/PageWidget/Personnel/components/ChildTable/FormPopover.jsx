import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Switch,
  Popover,
  Button,
  Row,
  PageHeader,
  Select,
  DatePicker,
  Col,
} from 'antd';
import { ComboGrid } from 'suid';
import { get } from 'lodash';
import moment from 'moment';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
const commonSpan = 12;
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

  getGenderProps = () => {
    const { form } = this.props;

    return {
      form,
      name: 'genderName',
      store: {
        type: 'GET',
        autoLoad: false,
        url: `${MDMSCONTEXT}/dataDict/getCanUseDataDictValues?dictCode=PUB-GENDER`,
      },
      columns: [
        {
          title: '代码',
          width: 120,
          dataIndex: 'dataValue',
        },
        {
          title: '名称',
          width: 160,
          dataIndex: 'dataName',
        },
      ],
      rowKey: 'dataValue',
      reader: {
        name: 'dataName',
        field: ['dataValue'],
      },
      field: ['gender'],
    };
  };

  getPopoverContent = () => {
    const { form, editData, isSaving, parentData } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

    return (
      <div
        style={{
          width: 900,
          overflow: 'hidden',
        }}
      >
        <PageHeader title="公司" subTitle={title} />
        <Form {...formItemLayout} layout="horizontal">
          <Row>
            <Col span={commonSpan}>
              <FormItem label="员工代码">
                {getFieldDecorator('code', {
                  initialValue: get(editData, 'code', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入员工代码',
                    },
                    {
                      max: 4,
                      message: '员工代码长度不能超过4',
                    },
                  ],
                })(<Input disabled={!!editData} />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="员工姓名">
                {getFieldDecorator('name', {
                  initialValue: get(editData, 'name', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入员工姓名',
                    },
                  ],
                })(<Input disabled={!!editData} />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="姓名缩写">
                {getFieldDecorator('shortName', {
                  initialValue: get(editData, 'shortName', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入姓名缩写',
                    },
                  ],
                })(<Input disabled={!!editData} />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="身份证">
                {getFieldDecorator('idCard', {
                  initialValue: get(editData, 'idCard', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入身份证',
                    },
                  ],
                })(<Input disabled={!!editData} />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="ERP公司代码">
                {getFieldDecorator('erpCorporationCode', {
                  initialValue: get(parentData, 'erpCode'),
                  rules: [
                    {
                      required: true,
                      message: '请输入ERP公司代码',
                    },
                  ],
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="在职状态">
                {getFieldDecorator('workingStatus', {
                  initialValue: get(editData, 'workingStatus'),
                  rules: [
                    {
                      required: true,
                      message: '请选择在职状态',
                    },
                  ],
                })(
                  <Select>
                    <Select.Option value="ON_JOB">正常</Select.Option>
                    <Select.Option value="RESIGNED">离职</Select.Option>
                    <Select.Option value="SUPERANNUATED">退休</Select.Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="员工组">
                {getFieldDecorator('personnelGroup', {
                  initialValue: get(editData, 'personnelGroup', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入员工组',
                    },
                    {
                      max: 1,
                      message: '员工组长度不能超过1',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="HR组织机构代码">
                {getFieldDecorator('hrOrganizationCode', {
                  initialValue: get(editData, 'hrOrganizationCode', ''),
                  rules: [
                    {
                      required: true,
                      message: '请选择Hr组织机构代码',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="HR组织机构名称">
                {getFieldDecorator('hrOrganizationName', {
                  initialValue: get(editData, 'hrOrganizationName', ''),
                  rules: [
                    {
                      required: true,
                      message: '请选择Hr组织机构名称',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="成本中心代码">
                {getFieldDecorator('costCenterCode', {
                  initialValue: get(editData, 'costCenterCode'),
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="性别" hidden>
                {getFieldDecorator('gender', {
                  initialValue: get(editData, 'gender'),
                })(<ComboGrid {...this.getGenderProps()} />)}
              </FormItem>
              <FormItem label="性别">
                {getFieldDecorator('genderName', {
                  initialValue: get(editData, 'genderName'),
                })(<ComboGrid {...this.getGenderProps()} />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="职位等级">
                {getFieldDecorator('postGrade', {
                  initialValue: get(editData, 'postGrade'),
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="生日">
                {getFieldDecorator('birthday', {
                  initialValue: moment(get(editData, 'birthday')),
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="电子邮件">
                {getFieldDecorator('email', {
                  initialValue: get(editData, 'email'),
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="移动电话">
                {getFieldDecorator('mobile', {
                  initialValue: get(editData, 'mobile'),
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="座机电话">
                {getFieldDecorator('telephone', {
                  initialValue: get(editData, 'telephone'),
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="邮政编码">
                {getFieldDecorator('postalCode', {
                  initialValue: get(editData, 'postalCode'),
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={commonSpan}>
              <FormItem label="通信地址">
                {getFieldDecorator('mailingAddress', {
                  initialValue: get(editData, 'mailingAddress'),
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
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
