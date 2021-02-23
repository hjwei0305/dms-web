import React, { Component } from 'react';
import cls from 'classnames';
import styles from './index.less';

class Center extends Component {
  static displayName = 'Center';

  handleCollapse = () => {};

  render() {
    const { children } = this.props;
    return <div className={cls(styles['layout-center'])}>{children}</div>;
  }
}

export default Center;
