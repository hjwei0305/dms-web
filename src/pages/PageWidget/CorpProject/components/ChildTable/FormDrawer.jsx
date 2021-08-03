import React, { Component } from 'react';
import { Input, Row, Col } from 'antd';
import { ComboList, ComboTree } from 'suid';
import { get } from 'lodash';
import FormDrawer from '@/components/FormDrawer';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
const commonSpan = 24;

class EditFormDrawer extends Component {
  getCategory = form => ({
    form,
    name: 'bankCategoryName',
    store: {
      type: 'POST',
      autoLoad: false,
      url: `${MDMSCONTEXT}/bankCategory/findByPage`,
    },
    reader: {
      name: 'name',
      description: 'code',
      field: ['code'],
    },
    field: ['bankCategoryCode'],
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

  getInnerOrderProps = form => {
    const { parentData } = this.props;
    return {
      form,
      name: 'innerOrderName',
      cascadeParams: {
        filters: [
          {
            fieldName: 'erpCorporationCode',
            operator: 'EQ',
            value: parentData.erpCode,
          },
        ],
      },
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/innerOrder/findByPage`,
      },
      reader: {
        name: 'name',
        description: 'code',
        field: ['id', 'code'],
      },
      field: ['innerOrderId', 'innerOrderCode'],
    };
  };

  getWbsProjectProps = form => {
    const { parentData } = this.props;

    return {
      form,
      name: 'wbsProjectName',
      store: {
        type: 'GET',
        autoLoad: false,
        url: `${MDMSCONTEXT}/wbsProject/getUnfrozenTree?erpCorporationCode=${parentData.erpCode}`,
      },
      reader: {
        name: 'name',
        description: 'code',
        field: ['id', 'code'],
      },
      field: ['wbsProjectId', 'wbsProjectCode'],
    };
  };

  renderFormItems = (form, FormItem) => {
    const { editData, parentData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <Row>
          <Col span={commonSpan}>
            <div
              style={{
                width: '90%',
                padding: '8px 0',
                marginLeft: '10%',
                textAlign: 'center',
                backgroundColor: 'lightyellow',
              }}
            >
              内部订单和wbs项目必须只能选择一个
            </div>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="erp公司代码" hidden>
              {getFieldDecorator('erpCorporationCode', {
                initialValue: get(parentData, 'erpCode', ''),
              })(<Input />)}
            </FormItem>
            <FormItem label="项目名称">
              {getFieldDecorator('name', {
                initialValue: get(editData, 'name', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入项目名称',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="wbs项目id" hidden>
              {getFieldDecorator('wbsProjectId', {
                initialValue: get(editData, 'wbsProjectId', ''),
              })(<Input />)}
            </FormItem>
            <FormItem label="wbs项目代码" hidden>
              {getFieldDecorator('wbsProjectCode', {
                initialValue: get(editData, 'wbsProjectCode', ''),
              })(<Input />)}
            </FormItem>
            <FormItem label="Wbs项目">
              {getFieldDecorator('wbsProjectName', {
                initialValue: get(editData, 'wbsProjectName'),
              })(<ComboTree allowClear {...this.getWbsProjectProps(form)} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="内部订单id" hidden>
              {getFieldDecorator('innerOrderId', {
                initialValue: get(editData, 'innerOrderId'),
              })(<Input />)}
            </FormItem>
            <FormItem label="内部订单代码" hidden>
              {getFieldDecorator('innerOrderCode', {
                initialValue: get(editData, 'innerOrderCode'),
              })(<Input />)}
            </FormItem>
            <FormItem label="内部订单">
              {getFieldDecorator('innerOrderName', {
                initialValue: get(editData, 'innerOrderName'),
              })(<ComboList allowClear {...this.getInnerOrderProps(form)} />)}
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
