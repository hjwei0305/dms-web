import React from 'react';
import { ProLayout } from 'suid';
import Head from './Header';
import Items from './Items';

import { useGlobal } from '../../hooks';

const { Header, Content } = ProLayout;

const Table = () => {
  const [config, dispatch] = useGlobal();
  return (
    <ProLayout>
      <Header height={128}>
        <Head
          onValuesChange={values => {
            dispatch({
              ...config,
              ...values,
            });
          }}
        />
      </Header>
      <Content>
        <Items />
      </Content>
    </ProLayout>
  );
};

export default Table;
