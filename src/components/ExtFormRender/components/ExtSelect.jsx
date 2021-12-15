import React, { Component } from 'react';
import cls from 'classnames';
import { Select } from 'antd';
import { get } from 'lodash';

import styles from './index.less';

class ExtSelect extends Component {
  handleChange = value => {
    const { name, onChange } = this.props;
    if (onChange) {
      onChange(name, value);
    }
  };

  render() {
    const { value, schema } = this.props;
    let options = [];
    try {
      options = JSON.parse(get(schema, 'ExtSelect.options'));
    } catch {
      options = [];
    }

    return (
      <div className={cls(styles['ext-cmp-width'])}>
        <Select style={{ width: '100%' }} value={value} onChange={this.handleChange}>
          {options.map(({ value, label }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
  }
}

export default ExtSelect;
