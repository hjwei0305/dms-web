import React from 'react';
import { ExtTable } from 'suid';
import { omit, get } from 'lodash';

class Content extends React.Component {
  getExtTableProps = () => {
    const { tableUiConfig = { columns: [] } } = this.props;
    const { columns } = tableUiConfig;
    const tempPlaceHolder = [];
    const searchProperties = [];
    columns.forEach(it => {
      const { title, canSearch, dataIndex } = it;
      if (canSearch) {
        tempPlaceHolder.push(title);
        searchProperties.push(dataIndex);
      }
    });
    Object.assign(tableUiConfig, {
      searchPlaceHolder: `请输入${tempPlaceHolder.join(',')}关键字进行查询`,
      searchProperties,
    });

    if (get(tableUiConfig, 'store.type') && get(tableUiConfig, 'store.url')) {
      return tableUiConfig;
    }

    return omit(tableUiConfig, 'store');
  };

  render() {
    return <ExtTable key={Math.random()} {...this.getExtTableProps()} />;
  }
}

export default Content;
