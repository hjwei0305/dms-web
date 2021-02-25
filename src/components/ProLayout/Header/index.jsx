import React, { Component } from 'react';
import { PageHeader } from 'antd';
import { pick } from 'lodash';
import cls from 'classnames';

import styles from './index.less';

class Header extends Component {
  static displayName = 'Header';

  handleCollapse = () => {};

  render() {
    const { children, size = 'middle', height = 60, gutter = [], className } = this.props;
    const [marginTop = 0, marginBottom = 0] = gutter;
    const style = {
      height,
      marginTop,
      marginBottom,
    };
    const pageHeaderProps = pick(this.props, [
      'title',
      'subTitle',
      'tags',
      'onBack',
      'extra',
      'backIcon',
    ]);
    return (
      <div
        className={cls(styles['layout-header'], styles[`layout-header-${size}`], className)}
        style={style}
      >
        {pageHeaderProps.title ? (
          <PageHeader {...pageHeaderProps}>{children}</PageHeader>
        ) : (
          <>{children}</>
        )}
      </div>
    );
  }
}

export default Header;
