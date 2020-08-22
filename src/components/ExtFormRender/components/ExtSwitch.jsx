import React, { Component } from 'react';
import cls from 'classnames';
import { Switch } from 'antd';

import styles from './index.less';

class ExtSwitch extends Component {
  handleChange = checked => {
    const { name, onChange } = this.props;
    if (onChange) {
      onChange(name, checked);
    }
  };

  render() {
    const { value } = this.props;

    return (
      <div className={cls(styles['ext-cmp-width'])}>
        <Switch checked={value} onChange={this.handleChange} />
      </div>
    );
  }
}

export default ExtSwitch;
