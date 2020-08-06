import React from 'react';
import ExtTablePreview from '@/components/ExtTablePreview';

class Content extends React.PureComponent {
  render() {
    const { tableUiConfig } = this.props;
    return <ExtTablePreview tableUiConfig={tableUiConfig} />;
  }
}

export default Content;
