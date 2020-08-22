import React, { Component } from 'react';
import cls from 'classnames';
import { Input } from 'antd';

import styles from './index.less';

const { TextArea } = Input;

class ExtTextArea extends Component {
  handleChange = e => {
    const { name, onChange } = this.props;
    if (onChange) {
      onChange(name, e.target.value);
    }
  };

  render() {
    const { value } = this.props;

    return (
      <div className={cls(styles['ext-cmp-width'])}>
        <TextArea rows={3} value={value} onChange={this.handleChange} />
      </div>
    );
  }
}

export default ExtTextArea;
