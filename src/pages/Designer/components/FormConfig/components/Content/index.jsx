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
    console.log('Content -> render -> uiConfig', uiConfig);
    console.log('Content -> render -> formData', formData);

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
