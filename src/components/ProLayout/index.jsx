import React, { Component } from 'react';
import cls from 'classnames';
import Header from './Header';
import Footer from './Footer';
import Center from './Center';
import SiderBar from './SiderBar';

import styles from './index.less';

class Layout extends Component {
  renderChildren = () => {
    const { children, layout = 'row' } = this.props;
    let cmps = [];
    if (layout === 'row') {
      cmps = React.Children.map(children, child => {
        if (child.type && ['Center', 'SiderBar'].includes(child.type.displayName)) {
          return React.cloneElement(child);
        }
      });
    }

    if (layout === 'column') {
      cmps = React.Children.map(children, child => {
        if (child.type && ['Header', 'Center', 'Footer'].includes(child.type.displayName)) {
          return React.cloneElement(child);
        }
      });
    }

    return cmps;
  };

  render() {
    const { layout = 'row' } = this.props;
    return (
      <div className={cls(styles['layout-wrapper'])} style={{ flexDirection: layout }}>
        {this.renderChildren()}
      </div>
    );
  }
}

export default Layout;

export { Header, Center, Footer, SiderBar };
