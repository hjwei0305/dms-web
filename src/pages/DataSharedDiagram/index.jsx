import React, { Component } from 'react';
import { ProLayout } from 'suid';
import ParentTable from './components/ParentTable';
import RelationTree from './components/RelationTree';

const { Content, SiderBar } = ProLayout;

export class DataSharedDiagram extends Component {
  render() {
    return (
      <ProLayout>
        <SiderBar allowCollapse gutter={[0, 4]}>
          <ParentTable />
        </SiderBar>
        <Content>
          <RelationTree />
        </Content>
      </ProLayout>
    );
  }
}

export default DataSharedDiagram;
