import React, { Component } from 'react';
import { ExtTable } from 'suid';

class ExtTreeTablePreview extends Component {
  getExtTableProps = () => {
    const columns = [
      {
        title: '代码',
        dataIndex: 'code',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '拼音',
        dataIndex: 'pinYin',
      },
      {
        title: '简写',
        dataIndex: 'shortName',
      },
      {
        title: '代码路径',
        dataIndex: 'codePath',
      },
      {
        title: '名称路径',
        dataIndex: 'namePath',
      },
    ];
    return {
      columns,
      lineNumber: false,
      defaultExpandAllRows: true,
      pagination: false,
      store: {
        url: '/api-gateway/mdms/region/getMultipleRoots',
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtTableProps()} />;
  }
}

export default ExtTreeTablePreview;
