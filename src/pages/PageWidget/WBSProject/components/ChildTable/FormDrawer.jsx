import React, { Component } from 'react';
import { Input, Row, Col } from 'antd';
import { ComboList } from 'suid';
import { get } from 'lodash';
import FormDrawer from '@/components/FormDrawer';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
const commonSpan = 24;

class EditFormDrawer extends Component {
  getLedgerAccountProps = form => {
    const { parentData } = this.props;
    const cascadeParams = {};
    Object.assign(cascadeParams, {
      erpCode: parentData.erpCode,
    });
    const url = `${MDMSCONTEXT}/ledgerAccount/search`;
    return {
      form,
      cascadeParams,
      name: 'ledgerAccountName',
      remotePaging: true,
      store: {
        type: 'POST',
        autoLoad: false,
        url,
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
    const { editData, parentData, isCreateChild } = this.props;
    const { getFieldDecorator } = form;

    const initData = isCreateChild ? null : editData;

    return (
      <>
        <Row>
          {isCreateChild && (
            <Col span={0}>
              <FormItem label="父节点id" hidden>
                {getFieldDecorator('parentId', {
                  initialValue: get(editData, 'id', ''),
                })(<Input disabled={!!editData} />)}
              </FormItem>
              <FormItem label="父节点代码" hidden>
                {getFieldDecorator('parentCode', {
                  initialValue: get(editData, 'code', ''),
                })(<Input disabled={!!editData} />)}
              </FormItem>
            </Col>
          )}
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
            <FormItem label="项目代码">
              {getFieldDecorator('code', {
                initialValue: get(initData, 'code', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入项目代码',
                  },
                  {
                    max: 30,
                    message: '项目代码长度不能超过30',
                  },
                ],
              })(<Input disabled={!!initData} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="项目名称">
              {getFieldDecorator('name', {
                initialValue: get(initData, 'name', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入项目名称',
                  },
                ],
              })(<Input disabled={!!initData} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="项目类型">
              {getFieldDecorator('projectType', {
                initialValue: get(initData, 'projectType', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入项目类型',
                  },
                ],
              })(<Input disabled={!!initData} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="成本中心代码">
              {getFieldDecorator('costCenterCode', {
                initialValue: get(initData, 'costCenterCode'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="业务范围代码">
              {getFieldDecorator('rangeCode', {
                initialValue: get(initData, 'rangeCode'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={0}>
            <FormItem label="总账科目代码" hidden>
              {getFieldDecorator('ledgerAccountCode', {
                initialValue: get(initData, 'ledgerAccountCode'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="总账科目">
              {getFieldDecorator('ledgerAccountName', {
                initialValue: get(initData, 'ledgerAccountName', ''),
              })(<ComboList allowClear {...this.getLedgerAccountProps(form)} />)}
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  render() {
    const { editData, confirmLoading, onOk, visible, onClose, isCreateChild } = this.props;
    let title = editData ? '编辑' : '新增';
    if (isCreateChild) {
      title = '新建子节点';
    }
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
