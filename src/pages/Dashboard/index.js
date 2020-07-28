import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
import Link from 'umi/link';
import cls from 'classnames';
import { ScrollBar } from 'suid';
import routes from '../../../config/router.config.js';
import styles from './index.less';

const { Header, Content } = Layout;
const { SubMenu } = Menu;

export default class Home extends Component {

  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.title)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  getSubMenuTitle = item => {
    const { title, } = item;
    return title;
  };

  getSubMenuOrItem = item => {
    if (item.routes && item.routes.some(child => child.title)) {
      return (
        <SubMenu title={this.getSubMenuTitle(item)} key={item.path}>
          {this.getNavMenuItems(item.routes)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  getMenuItemPath = item => {
    const { title } = item;
    const { location } = this.props;
    return (
      <Link to={item.path} replace={item.path === location.pathname}>
        <span>{title}</span>
      </Link>
    );
  };

  render() {
    return (
      <Layout className={cls(styles['main-box'])}>
        <Header className={cls('menu-header')}>应用菜单列表</Header>
        <Content className={cls('menu-box')}>
          <ScrollBar>
            <Menu defaultOpenKeys={['/']} key="Menu" mode="inline">
              {this.getNavMenuItems(routes)}
            </Menu>
          </ScrollBar>
        </Content>
      </Layout>
    );
  }
}
