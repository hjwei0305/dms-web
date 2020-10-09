import React, { PureComponent } from 'react';
import cls from 'classnames';

import styles from './index.less';

export class ExtExportPriview extends PureComponent {
  getTableRows = () => {
    const { colItems = [] } = this.props;
    return (
      <tr>
        {colItems.map(({ field, title }) => (
          <td key={field}>{title}</td>
        ))}
      </tr>
    );
  };

  render() {
    return (
      <table className={cls(styles['ext-export-preview'])}>
        <tbody>{this.getTableRows()}</tbody>
      </table>
    );
  }
}

export default ExtExportPriview;
