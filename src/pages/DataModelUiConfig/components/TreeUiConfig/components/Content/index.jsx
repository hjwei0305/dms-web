import React from 'react';
import ExtTreePreview from '@/components/ExtTreePreview';

const Content = ({ treeUiConfig, dataModelCode }) => {
  return <ExtTreePreview treeUiConfig={treeUiConfig} dataModelCode={dataModelCode} />;
};

export default Content;
