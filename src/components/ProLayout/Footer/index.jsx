import React, { Component } from 'react';
import cls from 'classnames';

import styles from './index.less';

class Footer extends Component {
  static displayName = 'Footer';

  handleCollapse = () => {};

  render() {
    const { children, height = 20, gutter = [], className } = this.props;
    const [marginTop = 0, marginBottom = 0] = gutter;

    const style = {
      height,
      marginTop,
      marginBottom,
    };

    return (
      <div className={cls(styles['layout-footer'], className)} style={style}>
        {children}
      </div>
    );
  }
}

export default Footer;
