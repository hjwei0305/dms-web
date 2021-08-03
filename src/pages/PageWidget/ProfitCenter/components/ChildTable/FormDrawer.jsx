import React, { Component } from 'react';
import { Input, Row, Col, Switch } from 'antd';
import { get } from 'lodash';
import FormDrawer from '@/components/FormDrawer';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
const commonSpan = 24;

class EditFormDrawer extends Component {
  getLedgerAccountProps = form => {
    const { parentData } = this.props;
    return {
      form,
      cascadeParams: {
        filters: [
          {
            fieldName: 'erpCorporationCode',
            operator: 'EQ',
            value: parentData.erpCode,
          },
        ],
      },
      name: 'ledgerAccountName',
      remotePaging: true,
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/innerOrder/findByPage`,
      },
      rowKey: 'id',
      reader: {
        name: 'name',
        description: 'code',
        field: ['code'],
      },
      field: ['ledgerAccountCode'],
    };
  };

  // getGenderProps = form => {
  //   return {
  //     form,
  //     name: 'genderName',
  //     store: {
  //       type: 'GET',
  //       autoLoad: false,
  //       url: `${MDMSCONTEXT}/dataDict/getCanUseDataDictValues?dictCode=PUB-GENDER`,
  //     },
  //     columns: [
  //       {
  //         title: '代码',
  //         width: 120,
  //         dataIndex: 'dataValue',
  //       },
  //       {
  //         title: '名称',
  //         width: 160,
  //         dataIndex: 'dataName',
  //       },
  //     ],
  //     rowKey: 'dataValue',
  //     reader: {
  //       name: 'dataName',
  //       field: ['dataValue'],
  //     },
  //     field: ['gender'],
  //   };
  // };

  renderFormItems = (form, FormItem) => {
    const { editData, parentData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <Row>
          <Col span={0}>
            <FormItem label="ERP公司代码" hidden>
              {getFieldDecorator('erpCorporationCode', {
                initialValue: get(parentData, 'erpCode', ''),
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="利润中心代码">
              {getFieldDecorator('code', {
                initialValue: get(editData, 'code', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入利润中心代码',
                  },
                  {
                    max: 10,
                    message: '利润中心代码长度不能超过10',
                  },
                ],
              })(<Input disabled={!!editData} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="利润中心名称">
              {getFieldDecorator('name', {
                initialValue: get(editData, 'name', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入利润中心名称',
                  },
                  {
                    max: 50,
                    message: '利润中心名称长度不能超过50',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="利润中心组">
              {getFieldDecorator('profitGroup', {
                initialValue: get(editData, 'profitGroup'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="负责人">
              {getFieldDecorator('keyPerson', {
                initialValue: get(editData, 'keyPerson'),
                rules: [
                  {
                    max: 20,
                    message: '负责人长度不能超过20',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="冻结">
              {getFieldDecorator('frozen', {
                valuePropName: 'checked',
                initialValue: get(editData, 'frozen', false),
              })(<Switch />)}
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  render() {
    const { editData, confirmLoading, onOk, visible, onClose, isCreateChild } = this.props;
    const title = editData ? '编辑' : '新建';
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
