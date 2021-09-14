import React from 'react';
import { ProLayout } from 'suid';
import { Tabs, Empty, Button } from 'antd';
import cls from 'classnames';
import Head from './Header';
import Edit from '../Edit';
import Del from '../Del';

import styles from './index.less';

import { useGlobal } from '../../hooks';

const { Header, Content } = ProLayout;
const { TabPane } = Tabs;

const OptColumn = () => {
  const [{ optCol }, dispatch] = useGlobal();
  return (
    <ProLayout className={cls(styles['opt-column'])}>
      <Header height={128}>
        <Head
          onValuesChange={values => {
            dispatch({
              optCol: {
                ...optCol,
                ...values,
              },
            });
          }}
        />
      </Header>
      <Content>
        <Tabs>
          <TabPane tab="编辑" key="edit">
            <Edit />
          </TabPane>
          <TabPane tab="删除" key="del">
            <Del />
          </TabPane>
          <TabPane tab="自定义" key="custom">
            <Empty description="暂无配置">
              <Button type="primary">去配置</Button>
            </Empty>
          </TabPane>
        </Tabs>
      </Content>
    </ProLayout>
  );
};

export default OptColumn;
