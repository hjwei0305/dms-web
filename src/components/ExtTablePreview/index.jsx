import React from 'react';
import { ExtTable } from 'suid';
import { isEmpty } from 'lodash';
import formatters from './formatter';

class Content extends React.Component {
  getExtTableProps = () => {
    const { tableUiConfig = { columns: [] }, store } = this.props;
    const { columns } = tableUiConfig;
    const tempPlaceHolder = [];
    const searchProperties = [];
    const sortField = {};
    columns.forEach(it => {
      const { title, canSearch, dataIndex, formatter, sort } = it;
      if (canSearch) {
        tempPlaceHolder.push(title);
        searchProperties.push(dataIndex);
      }
      if (formatter) {
        Object.assign(it, {
          render: formatters[formatter],
        });
      }
      if (sort) {
        sortField[dataIndex] = 'asc';
      }
    });
    Object.assign(tableUiConfig, {
      searchPlaceHolder: `请输入${tempPlaceHolder.join(',')}关键字进行查询`,
      searchProperties,
      sort: !isEmpty(sortField)
        ? {
            multiple: true,
            field: sortField,
          }
        : null,
    });

    tableUiConfig.store = store;

    return tableUiConfig;
  };

  render() {
    return <ExtTable key={Math.random()} {...this.getExtTableProps()} />;
  }
}

export default Content;
