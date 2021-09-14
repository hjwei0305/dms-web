import React from 'react';
import { ProLayout } from 'suid';
import Head from './Header';
import Items from './Items';

import { useGlobal } from '../../hooks';

const { Header, Content } = ProLayout;

const Add = () => {
  const [{ add }, dispatch] = useGlobal();
  return (
    <ProLayout>
      <Header height={128}>
        <Head
          onValuesChange={values => {
            dispatch({
              add: {
                ...add,
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

export default Add;
