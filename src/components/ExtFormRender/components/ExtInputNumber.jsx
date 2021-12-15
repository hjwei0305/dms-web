import React, { Component } from 'react';
import cls from 'classnames';
import { InputNumber } from 'antd';

import styles from './index.less';

class ExtInputNumber extends Component {
  handleChange = value => {
    const { name, onChange } = this.props;
    if (onChange) {
      onChange(name, value);
    }
  };

  render() {
    const { value, schema } = this.props;
    const { precision, min } = schema;
    console.log('ExtInputNumber -> render -> schema', schema);

    return (
      <div className={cls(styles['ext-cmp-width'])}>
        <InputNumber
          min={min || 0}
          precision={precision || 0}
          style={{ width: '100%' }}
          value={value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default ExtInputNumber;
