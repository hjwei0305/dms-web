import React, { Component } from 'react';
import cls from 'classnames';
import moment from 'moment';
import { DatePicker } from 'antd';

import styles from './index.less';

class ExtDate extends Component {
  handleChange = (_, dateString) => {
    const { name, onChange } = this.props;
    if (onChange) {
      onChange(name, dateString);
    }
  };

  render() {
    const { value } = this.props;

    return (
      <div className={cls(styles['ext-cmp-width'])}>
        <DatePicker style={{ width: '100%' }} value={moment(value)} onChange={this.handleChange} />
      </div>
    );
  }
}

export default ExtDate;
