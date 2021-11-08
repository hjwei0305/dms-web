import React from 'react';
import { ProLayout } from 'suid';
import Head from './Header';
import Items from './Items';

import { useGlobal } from '../../hooks';

const { Header, Content } = ProLayout;

const Filter = () => {
  const [{ filter }, dispatch] = useGlobal();
  return (
    <ProLayout>
      <Header height={90}>
        <Head
          onValuesChange={values => {
            dispatch({
              filter: {
                ...filter,
                ...values,
              },
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

export default Filter;
