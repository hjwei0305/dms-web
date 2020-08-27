import React, { Component } from 'react';
import { get, omit, cloneDeep } from 'lodash';
import FormRender from 'form-render/lib/antd.js';
import ExtComps from './components';

// 通过uiSchema可以增强 Form Render 展示的丰富性，比如说日历视图
const uiSchema = {
  dateDemo: {
    'ui:widget': 'date',
  },
  // radioDemo: {
  //   "ui:width": "50%"
  // }
};

class ExtFormRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: props.formData || {},
    };
  }

  onChange = formData => {
    const keys = Object.keys(formData).filter(key => /(__ds)$/.test(key));
    const tempFormData = {};
    keys.forEach(key => {
      Object.assign(tempFormData, { ...formData[key] });
    });
    const submitData = { ...omit(formData, keys), ...tempFormData };
    this.setState({ formData: submitData }, () => {
      const { onChange } = this.props;
      if (onChange) {
        onChange(submitData);
      }
    });
  };

  onValidate = valid => {
    const { onValidate } = this.props;
    if (onValidate) {
      onValidate(valid);
    }
  };

  render() {
    const { formData } = this.state;
    const { uiConfig } = this.props;
    const tempProperties = cloneDeep(get(uiConfig, 'formItems', []));
    const properties = {};
    const required = [];
    tempProperties.forEach(item => {
      const [{ code: key }, value = {}] = item;
      if (value.required) {
        required.push(key);
      }
      Object.assign(value, { type: 'string' });
      Object.assign(properties, { [key]: value });
    });

    return (
      <div
        style={{
          height: '100%',
        }}
      >
        <FormRender
          {...uiConfig}
          propsSchema={{
            properties,
            required,
            type: 'object',
          }}
          uiSchema={uiSchema}
          formData={formData}
          onChange={this.onChange}
          onValidate={this.onValidate}
          widgets={{ ...ExtComps }}
        />
      </div>
    );
  }
}

export default ExtFormRender;
