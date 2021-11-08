import React from 'react';
import { ProLayout } from 'suid';
import { Tabs } from 'antd';
import cls from 'classnames';
// import Head from './Header';
import Add from '../Add';
import Filter from '../Filter';
import QuickSearch from '../QuickSearch';

import styles from './index.less';

// import { useGlobal } from '../../hooks';

const { Content } = ProLayout;
const { TabPane } = Tabs;

const ToolBar = () => {
  // const [{ add, }, dispatch] = useGlobal();
  return (
    <ProLayout className={cls(styles['tool-bar'])}>
      {/* <Header height={128}>
        <Head onValuesChange={values => {
          dispatch({
            add: {
              ...add,
              ...values,
            }
          });
        }} />
      </Header> */}
      <Content>
        <Tabs>
          <TabPane tab="新建" key="add">
            <Add />
          </TabPane>
          <TabPane tab="快速查询" key="quickSearch">
            <QuickSearch />
          </TabPane>
          <TabPane tab="过滤" key="filter">
            <Filter />
          </TabPane>
          <TabPane tab="前缀" key="prefix">
            前缀
          </TabPane>
          <TabPane tab="后缀" key="postfix">
            后缀
          </TabPane>
        </Tabs>
      </Content>
    </ProLayout>
  );
};

export default ToolBar;
