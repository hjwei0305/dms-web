import React from 'react';
import { Input, Select, Row, Col } from 'antd';
import { ComboList } from 'suid';
import { get } from 'lodash';
import { constants } from '@/utils';
import SimpleTable from '@/components/SimpleTable';
import { save, remove } from './service';

const { MDMSCONTEXT } = constants;
const RECEIVER_TYPE = {
  H: '员工',
  K: '供应商',
  D: '客户',
};

const USE_SCOPE = {
  ALL: '通用',
  BILL: '票据',
  CASH: '现汇',
};
const colSpan = 24;

const PaymentInfo = () => {
  const getComboListProps = form => {
    const { getFieldValue } = form;

    const receiverType = getFieldValue('receiverType');

    let tempPath = 'personnel';
    if (receiverType === 'K') {
      tempPath = 'supplier';
    }

    if (receiverType === 'D') {
      tempPath = 'customer';
    }

    return {
      key: receiverType,
      form,
      allowClear: true,
      name: 'receiverName',
      searchPlaceHolder: '请输入代码或名称关键字搜索',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/${tempPath}/findByPage`,
      },
      rowKey: 'id',
      reader: {
        name: 'name',
        description: 'code',
        field: ['id', 'code'],
      },
      field: ['receiverId', 'receiverCode'],
    };
  };

  const getBankComboListProps = form => {
    return {
      form,
      allowClear: true,
      name: 'bankName',
      searchPlaceHolder: '请输入代码或名称关键字搜索',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/bank/findByPage`,
      },
      rowKey: 'id',
      reader: {
        name: 'name',
        description: 'code',
        field: ['id', 'code', 'erpBankCode'],
      },
      field: ['bankId', 'bankCode', 'erpBankCode'],
    };
  };

  const tableProps = {
    searchPlaceHolder: '输入城市代码或者名称',
    searchProperties: ['code', 'name'],
    modalWidth: 600,
    formCfg: {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    },
    actions: {
      add: save,
      edit: save,
      del: remove,
    },
    store: {
      type: 'POST',
      url: `${MDMSCONTEXT}/paymentInfo/findByPage`,
    },
    renderFormItems: (form, FormItem, editData) => {
      const { getFieldDecorator, setFieldsValue } = form;
      return (
        <Row>
          <Col span={colSpan}>
            <FormItem label="收款对象类型">
              {getFieldDecorator('receiverType', {
                initialValue: get(editData, 'receiverType', 'H'),
                rules: [
                  {
                    required: true,
                    message: '请选择收款对象类型',
                  },
                ],
              })(
                <Select
                  onChange={() => {
                    setFieldsValue({ receiverName: '' });
                  }}
                >
                  {Object.keys(RECEIVER_TYPE).map(key => (
                    <Select.Option key={key} value={key}>
                      {RECEIVER_TYPE[key]}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem label="收款对象Id" hidden>
              {getFieldDecorator('receiverId', {
                initialValue: get(editData, 'receiverId'),
              })(<Input />)}
            </FormItem>
            <FormItem label="收款对象Code" hidden>
              {getFieldDecorator('receiverCode', {
                initialValue: get(editData, 'receiverCode'),
              })(<Input />)}
            </FormItem>
            <FormItem label="收款对象">
              {getFieldDecorator('receiverName', {
                initialValue: get(editData, 'receiverName'),
                rules: [
                  {
                    required: true,
                    message: '请选择收款对象',
                  },
                ],
              })(<ComboList {...getComboListProps(form)} />)}
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem label="银行省区代码" hidden>
              {getFieldDecorator('bankProvinceCode', {
                initialValue: get(editData, 'bankProvinceCode'),
              })(<Input />)}
            </FormItem>
            <FormItem label="银行省区" hidden>
              {getFieldDecorator('bankProvinceName', {
                initialValue: get(editData, 'bankProvinceName'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem label="银行地区代码" hidden>
              {getFieldDecorator('bankAreaCode', {
                initialValue: get(editData, 'bankAreaCode'),
              })(<Input />)}
            </FormItem>
            <FormItem label="银行地区" hidden>
              {getFieldDecorator('bankAreaName', {
                initialValue: get(editData, 'bankAreaName'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem label="银行id" hidden>
              {getFieldDecorator('bankId', {
                initialValue: get(editData, 'bankId'),
              })(<Input />)}
            </FormItem>
            <FormItem label="银行代码" hidden>
              {getFieldDecorator('bankCode', {
                initialValue: get(editData, 'bankCode'),
              })(<Input />)}
            </FormItem>
            <FormItem label="erp银行代码" hidden>
              {getFieldDecorator('erpBankCode', {
                initialValue: get(editData, 'erpBankCode'),
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
              })(<ComboList {...getBankComboListProps(form)} />)}
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem label="银行户名">
              {getFieldDecorator('bankAccountName', {
                initialValue: get(editData, 'bankAccountName'),
                rules: [
                  {
                    required: true,
                    message: '请输入银行户名',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={colSpan}>
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
          <Col span={colSpan}>
            <FormItem label="账号用途">
              {getFieldDecorator('useScope', {
                initialValue: get(editData, 'useScope'),
                rules: [
                  {
                    required: true,
                    message: '请选择帐号用途',
                  },
                ],
              })(
                <Select>
                  {Object.keys(USE_SCOPE).map(key => (
                    <Select.Option key={key} value={key}>
                      {USE_SCOPE[key]}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
      );
    },
    columns: [
      {
        title: '银行帐号',
        dataIndex: 'bankAccountNumber',
      },
      {
        title: '银行户名',
        dataIndex: 'bankAccountName',
      },
      {
        title: '帐号用途',
        dataIndex: 'useScope',
        render: useScope => USE_SCOPE[useScope],
      },
      {
        title: '银行名称',
        dataIndex: 'bankName',
      },
      {
        title: '银行代码',
        dataIndex: 'bankCode',
      },
      {
        title: 'erp银行代码',
        dataIndex: 'erpBankCode',
      },
      {
        title: '银行行别代码',
        dataIndex: 'bankCategoryCode',
        render: bankCategoryCode => bankCategoryCode || '-',
      },
      {
        title: '银行行别名称',
        dataIndex: 'bankCategoryName',
        render: bankCategoryName => bankCategoryName || '-',
      },
    ],
  };

  return <SimpleTable {...tableProps} />;
};

export default PaymentInfo;
