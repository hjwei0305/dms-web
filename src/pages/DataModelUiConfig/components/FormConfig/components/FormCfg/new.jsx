import React from 'react';
import { Form, Switch, Select, Slider } from 'antd';
import { get } from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};

@Form.create()
class FormCfg extends React.Component {
  handleSave = () => {
    const { form, editData, onSave } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        onSave({ ...editData, ...formData });
      }
    });
  };

  updateUiConfig = uiConfig => {
    const { onEditTable } = this.props;

    if (onEditTable) {
      onEditTable(uiConfig);
    }
  };

  // getCardExtra = () => {
  //   return (
  //     <span className={cls('icon-wrapper')}>
  //       <ExtIcon
  //         type="save"
  //         style={{ fontSize: '20px' }}
  //         tooltip={{ title: '保存' }}
  //         onClick={this.handleSave}
  //         antd
  //       />
  //     </span>
  //   );
  // };

  render() {
    const { editData, form, dataModel } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form layout="inline">
        <FormItem label="整体布局">
          {getFieldDecorator('column', {
            initialValue: get(editData, 'column', 1),
            rules: [
              {
                required: true,
                message: '整体布局不能为空',
              },
            ],
          })(
            <Select
              style={{ marginRight: 8 }}
              onChange={column => {
                this.updateUiConfig({ column });
              }}
            >
              <Option value={1}>一行一列</Option>
              <Option value={2}>一行二列</Option>
              <Option value={3}>一行三列</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem label="展示方式">
          {getFieldDecorator('displayType', {
            initialValue: get(editData, 'displayType', 'column'),
            rules: [
              {
                required: true,
                message: '展示方式不能为空',
              },
            ],
          })(
            <Select
              onChange={displayType => {
                this.updateUiConfig({ displayType });
              }}
            >
              <Option value="column">上下排列</Option>
              <Option value="row">左右排列</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem label="标签宽度">
          {getFieldDecorator('labelWidth', {
            initialValue: get(editData, 'labelWidth', 80),
          })(
            <Slider
              max={200}
              min={20}
              style={{ width: 200 }}
              onChange={labelWidth => this.updateUiConfig({ labelWidth })}
            />,
          )}
        </FormItem>
        {get(dataModel, 'dataStructure', 'LIST') === 'TREE' ? (
          <FormItem label="允许创根">
            {getFieldDecorator('canCreateRoot', {
              valuePropName: 'checked',
              initialValue: get(editData, 'canCreateRoot', false),
            })(
              <Switch
                onChange={canCreateRoot => {
                  this.updateUiConfig({ canCreateRoot });
                }}
              />,
            )}
          </FormItem>
        ) : null}
        <FormItem
          label="描述"
          style={{
            display: 'none',
          }}
        >
          {getFieldDecorator('showDescIcon', {
            valuePropName: 'checked',
            initialValue: get(editData, 'showDescIcon', true),
          })(
            <Switch
              checkedChildren="关描述"
              onChange={showDescIcon => {
                this.updateUiConfig({ showDescIcon });
              }}
              unCheckedChildren="开描述"
            />,
          )}
        </FormItem>
      </Form>
    );
  }
}

export default FormCfg;
