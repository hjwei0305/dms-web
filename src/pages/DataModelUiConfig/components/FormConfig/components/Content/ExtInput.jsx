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
    // const { name, schema} = this.props;

    return (
      <div className={cls(styles['ext-input'])}>
        <Input onChange={this.handleChange} />
      </div>
    );
  }
}

export default ExtInput;
