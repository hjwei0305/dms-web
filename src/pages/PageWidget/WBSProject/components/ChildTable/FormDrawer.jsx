import React, { Component } from 'react';
import { Input, Row, Select, DatePicker, Col } from 'antd';
import { ComboGrid } from 'suid';
import { get } from 'lodash';
import moment from 'moment';
import FormDrawer from '@/components/FormDrawer';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
const commonSpan = 24;

class EditFormDrawer extends Component {
  getGenderProps = form => {
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

  renderFormItems = (form, FormItem) => {
    const { editData, parentData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <Row>
          <Col span={commonSpan}>
            <FormItem label="项目代码">
              {getFieldDecorator('code', {
                initialValue: get(editData, 'code', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入项目代码',
                  },
                  {
                    max: 4,
                    message: '项目代码长度不能超过4',
                  },
                ],
              })(<Input disabled={!!editData} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="项目姓名">
              {getFieldDecorator('name', {
                initialValue: get(editData, 'name', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入项目姓名',
                  },
                ],
              })(<Input disabled={!!editData} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="ERP公司代码">
              {getFieldDecorator('erpCorporationCode', {
                initialValue: get(parentData, 'erpCode', ''),
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
            <FormItem label="项目类型">
              {getFieldDecorator('projectType', {
                initialValue: get(editData, 'projectType', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入项目类型',
                  },
                ],
              })(<Input disabled={!!editData} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="创建日期">
              {getFieldDecorator('erpCreateDate', {
                initialValue: moment(get(editData, 'erpCreateDate')),
                rules: [
                  {
                    required: true,
                    message: '请选择创建日期',
                  },
                ],
              })(<DatePicker style={{ width: '100%' }} />)}
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
            <FormItem label="业务范围代码">
              {getFieldDecorator('rangeCode', {
                initialValue: get(editData, 'rangeCode'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="总账科目代码">
              {getFieldDecorator('ledgerAccountCode', {
                initialValue: get(editData, 'ledgerAccountCode'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="总账科目名称">
              {getFieldDecorator('ledgerAccountName', {
                initialValue: get(editData, 'ledgerAccountName'),
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  render() {
    const { editData, confirmLoading, onOk, visible, onClose } = this.props;
    const title = editData ? '编辑' : '新增';
    return (
      <FormDrawer
        title={title}
        visible={visible}
        onClose={onClose}
        width={550}
        onOk={onOk}
        confirmLoading={confirmLoading}
        renderFormItems={this.renderFormItems}
      />
    );
  }
}

export default EditFormDrawer;
