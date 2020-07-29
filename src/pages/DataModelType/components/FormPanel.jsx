import React, { PureComponent } from 'react';
import { Form, Input, Checkbox, InputNumber, Button } from 'antd';
import { connect } from 'dva';
import { ScrollBar } from 'suid';

const FormItem = Form.Item;
const buttonWrapper = { span: 18, offset: 6 };

@connect(({ dataModelType, loading }) => ({ dataModelType, loading }))
@Form.create()
class FormModal extends PureComponent {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  onFormSubmit = () => {
    const { form, dataModelType, isCreate } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      const selectedTreeNode = dataModelType.selectedTreeNode || {};
      if (isCreate) {
        Object.assign(params, { parentId: selectedTreeNode.id });
      } else {
        Object.assign(params, selectedTreeNode);
      }
      Object.assign(params, formData);
      this.save(params);
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelType/save',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'dataModelType/queryTree',
        });
      }
    });
  };

  render() {
    const { form, dataModelType, isCreate } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: isCreate ? 18 : 10,
      },
    };
    let tempSelectedNode = dataModelType.selectedTreeNode || {};
    if (isCreate) {
      tempSelectedNode = { parentName: tempSelectedNode.name };
    }
    const {
      code = '',
      parentName = '',
      name = '',
      shortName = '',
      rank = '',
      frozen = false,
    } = tempSelectedNode;

    return (
      <ScrollBar>
        <Form {...formItemLayout} layout="horizontal">
          {!isCreate ? (
            <FormItem label="代码">
              {getFieldDecorator('code', {
                initialValue: code,
                rules: [
                  {
                    required: true,
                    message: '代码不能为空',
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
          ) : (
            <FormItem label="父亲节点">
              {getFieldDecorator('parentName', {
                initialValue: parentName,
              })(<Input disabled />)}
            </FormItem>
          )}
          <FormItem label="名称">
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="简称">
            {getFieldDecorator('shortName', {
              initialValue: shortName,
            })(<Input />)}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('rank', {
              initialValue: rank,
              rules: [
                {
                  required: true,
                  message: '序号不能为空',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} precision={0} />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              valuePropName: 'checked',
              initialValue: frozen,
            })(<Checkbox />)}
          </FormItem>
          {!isCreate ? (
            <FormItem wrapperCol={buttonWrapper}>
              <Button type="primary" onClick={this.onFormSubmit}>
                确定
              </Button>
            </FormItem>
          ) : null}
        </Form>
      </ScrollBar>
    );
  }
}

export default FormModal;
