import React, { Component } from 'react';
import { Input, Row, Col } from 'antd';
import { ComboList } from 'suid';
import { get } from 'lodash';
import FormDrawer from '@/components/FormDrawer';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
const commonSpan = 24;

class EditFormDrawer extends Component {
  getCategory = form => ({
    form,
    name: 'bankCategoryName',
    remotePaging: true,
    store: {
      type: 'POST',
      autoLoad: false,
      url: `${MDMSCONTEXT}/bankCategory/findByPage`,
    },
    reader: {
      name: 'name',
      description: 'code',
      field: ['id'],
    },
    field: ['bankCategoryId'],
  });

  getCurrency = form => ({
    form,
    name: 'currencyName',
    store: {
      type: 'POST',
      autoLoad: false,
      url: `${MDMSCONTEXT}/currency/findByPage`,
    },
    reader: {
      name: 'name',
      description: 'code',
      field: ['id', 'code'],
    },
    field: ['currencyId', 'currencyCode'],
  });

  getLedgerAccount = form => {
    const { parentData } = this.props;
    return {
      form,
      name: 'ledgerAccountName',
      remotePaging: true,
      cascadeParams: {
        erpCode: get(parentData, 'erpCode', ''),
      },
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/ledgerAccount/search`,
      },
      reader: {
        name: 'name',
        description: 'code',
        field: ['code'],
      },
      field: ['ledgerAccountCode'],
    };
  };

  getBank = form => {
    const { getFieldValue } = form;
    const bankCategoryId = getFieldValue('bankCategoryId');
    const cascadeParams = {
      filters: [],
    };

    if (bankCategoryId) {
      cascadeParams.filters.push({
        fieldName: 'bankCategoryId',
        operator: 'EQ',
        value: bankCategoryId,
      });
    }

    return {
      form,
      name: 'bankName',
      cascadeParams,
      remotePaging: true,
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/bank/findByPage`,
      },
      reader: {
        name: 'name',
        description: 'code',
        field: ['id', 'code'],
      },
      field: ['bankId', 'bankCode'],
    };
  };

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
            <FormItem label="公司代码" hidden>
              {getFieldDecorator('corporationCode', {
                initialValue: get(parentData, 'code', ''),
              })(<Input />)}
            </FormItem>
            <FormItem label="银行类别代码" hidden>
              {getFieldDecorator('bankCategoryId', {
                initialValue: get(editData, 'bankCategoryId', ''),
              })(<Input />)}
            </FormItem>
            <FormItem label="银行类别">
              {getFieldDecorator('bankCategoryName', {
                initialValue: get(editData, 'bankCategoryName'),
                rules: [
                  {
                    required: true,
                    message: '请选择银行类别',
                  },
                ],
              })(<ComboList {...this.getCategory(form)} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="银行id" hidden>
              {getFieldDecorator('bankId', {
                initialValue: get(editData, 'bankId', ''),
              })(<Input />)}
            </FormItem>
            <FormItem label="银行号" hidden>
              {getFieldDecorator('bankCode', {
                initialValue: get(editData, 'bankCode', ''),
              })(<Input />)}
            </FormItem>
            <FormItem label="银行">
              {getFieldDecorator('bankName', {
                initialValue: get(editData, 'bankName'),
                rules: [
                  {
                    required: true,
                    message: '请选择银行',
                  },
                ],
              })(<ComboList {...this.getBank(form)} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="银行户名">
              {getFieldDecorator('bankAccountName', {
                initialValue: get(editData, 'bankAccountName', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入银行户名',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="银行帐号">
              {getFieldDecorator('bankAccountNumber', {
                initialValue: get(editData, 'bankAccountNumber'),
                rules: [
                  {
                    required: true,
                    message: '请输入银行帐号',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="货币" hidden>
              {getFieldDecorator('currencyId', {
                initialValue: get(editData, 'currencyId'),
              })(<Input />)}
            </FormItem>
            <FormItem label="货币" hidden>
              {getFieldDecorator('currencyCode', {
                initialValue: get(editData, 'currencyCode'),
              })(<Input />)}
            </FormItem>
            <FormItem label="货币">
              {getFieldDecorator('currencyName', {
                initialValue: get(editData, 'currencyName'),
                rules: [
                  {
                    required: true,
                    message: '请选择货币',
                  },
                ],
              })(<ComboList {...this.getCurrency(form)} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="科目代码" hidden>
              {getFieldDecorator('ledgerAccountCode', {
                initialValue: get(editData, 'ledgerAccountCode'),
              })(<Input />)}
            </FormItem>
            <FormItem label="科目">
              {getFieldDecorator('ledgerAccountName', {
                initialValue: get(editData, 'ledgerAccountName'),
                rules: [
                  {
                    required: true,
                    message: '请选择科目',
                  },
                ],
              })(<ComboList {...this.getLedgerAccount(form)} />)}
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
