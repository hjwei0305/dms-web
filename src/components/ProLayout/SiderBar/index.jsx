import React, { Component } from 'react';
import cls from 'classnames';
// import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ExtIcon } from 'suid';
import styles from './index.less';

class SiderBar extends Component {
  static displayName = 'SiderBar';

  state = {
    collapseVisible: false,
    collapsed: false,
  };

  handleCollapse = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  toggleVisible = collapseVisible => {
    this.setState({
      collapseVisible,
    });
  };

  getCollapseIcon = () => {
    const { collapsed } = this.state;
    const { collapseMode = 'lr' } = this.props;
    if (collapseMode === 'lr') {
      return <>{collapsed ? <ExtIcon type="right" antd /> : <ExtIcon type="left" antd />}</>;
    }

    if (collapseMode === 'rl') {
      return <>{collapsed ? <ExtIcon type="left" antd /> : <ExtIcon type="right" antd />}</>;
    }
  };

  render() {
    const { children, gutter = [], collapseMode = 'lr', allowCollapse, className } = this.props;
    const { collapseVisible, collapsed } = this.state;
    const [marginLeft = 0, marginRight = 0] = gutter;
    let style = {
      marginLeft,
      marginRight,
    };
    if (collapsed) {
      style = {};
    }
    return (
      <div
        className={cls({
          [styles['layout-left-siderbar']]: true,
          [styles['layout-left-siderbar-collapsed']]: collapsed,
        })}
        onMouseEnter={() => this.toggleVisible(true)}
        onMouseLeave={() => this.toggleVisible(false)}
        style={style}
      >
        <div className={cls('content', className)}>{children}</div>
        {allowCollapse && (collapseVisible || collapsed) ? (
          <div
            onClick={this.handleCollapse}
            className={cls({
              'collapse-icon': true,
              'collapse-icon-middle': !collapsed,
              [`collapse-icon-${collapseMode}`]: true,
            })}
          >
            {this.getCollapseIcon()}
          </div>
        ) : null}
      </div>
    );
  }
}

export default SiderBar;
