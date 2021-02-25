import React, { Component } from 'react';
import cls from 'classnames';
import styles from './index.less';

class Center extends Component {
  static displayName = 'Center';

  handleCollapse = () => {};

  render() {
    const { children, style, className } = this.props;
    return (
      <div className={cls(styles['layout-center'], className)} style={style}>
        {children}
      </div>
    );
  }
}

export default Center;
