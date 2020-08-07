import React, { Component } from 'react';
import ExtFormRender from '@/components/ExtFormRender';

class Content extends Component {
  onChange = formData => {
    console.log('Content -> formData', formData);
  };

  onValidate = valid => {
    console.log('没有通过的校验:', valid);
  };

  render() {
    const { uiConfig, formData } = this.props;

    return (
      <ExtFormRender
        onChange={this.onChange}
        onValidate={this.onValidate}
        uiConfig={uiConfig}
        formData={formData || {}}
      />
    );
  }
}

export default Content;
