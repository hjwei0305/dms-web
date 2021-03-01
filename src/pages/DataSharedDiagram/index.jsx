import React, { Component } from 'react';
import ProLayout, { Center, SiderBar } from '@/components/ProLayout';
import ParentTable from './components/ParentTable';
import RelationTree from './components/RelationTree';

export class DataSharedDiagram extends Component {
  render() {
    return (
      <ProLayout>
        <SiderBar allowCollapse gutter={[0, 8]}>
          <ParentTable />
        </SiderBar>
        <Center>
          <RelationTree />
        </Center>
      </ProLayout>
    );
  }
}

export default DataSharedDiagram;
