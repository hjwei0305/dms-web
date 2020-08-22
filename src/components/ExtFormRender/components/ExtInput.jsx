import React, { Component } from 'react';
import cls from 'classnames';
import { Input } from 'antd';

import styles from './index.less';

class ExtInput extends Component {
  handleChange = e => {
    const { name, onChange } = this.props;
    if (onChange) {
      onChange(name, e.target.value);
    }
  };

  render() {
    const { value, options } = this.props;

    return (
      <div className={cls(styles['ext-cmp-width'])}>
        <Input {...options} value={value} onChange={this.handleChange} />
      </div>
    );
  }
}

export default ExtInput;
