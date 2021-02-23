import React, { Component } from 'react';
import cls from 'classnames';

import styles from './index.less';

class Header extends Component {
  static displayName = 'Header';

  handleCollapse = () => {};

  render() {
    const { children, height = 20, gutter = [] } = this.props;
    const [marginTop = 0, marginBottom = 0] = gutter;
    const style = {
      height,
      marginTop,
      marginBottom,
    };
    return (
      <div className={cls(styles['layout-header'])} style={style}>
        {children}
      </div>
    );
  }
}

export default Header;
