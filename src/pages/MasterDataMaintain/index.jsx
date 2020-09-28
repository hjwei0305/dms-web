import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { get } from 'lodash';
import cls from 'classnames';
import { Empty } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import CascadeLayout from '@/components/Layout/CascadeLayout';
import ExtTreePreview from '@/components/ExtTreePreview';
import ParentTable from './components/ParentTable';
import ChildTable from './components/ChildTable';
import styles from './index.less';

@withRouter
@connect(({ masterDataMaintain, loading }) => ({ masterDataMaintain, loading }))
class MasterDataMaintain extends Component {
  getRightCmp = () => {
    const { masterDataMaintain } = this.props;
    const { currPRowData, modelUiConfig } = masterDataMaintain;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const formUiConfig = get(uiObj, 'formConfig', null);
    const tableUiConfig = get(uiObj, 'showConfig', null);
    // const formUiConfig = JSON.parse(get(modelUiConfig, 'formData', null));
    // const tableUiConfig = JSON.parse(get(modelUiConfig, 'tableData', null));
    const dataStructure = get(modelUiConfig, 'dataStructure', 'GENERAL');

    if (currPRowData && formUiConfig && tableUiConfig && dataStructure === 'TREE') {
      return (
        <ExtTreePreview
          key={currPRowData.id}
          slot="right"
          treeUiConfig={tableUiConfig}
          dataModelCode={modelUiConfig.code}
          formUiConfig={formUiConfig}
        />
      );
    }

    if (currPRowData && tableUiConfig && dataStructure === 'GENERAL') {
      return <ChildTable key={currPRowData.id} slot="right" modelUiConfig={modelUiConfig} />;
    }

    return null;
  };

  render() {
    const { masterDataMaintain, loading } = this.props;
    const { currPRowData } = masterDataMaintain;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <CascadeLayout
          title={['主数据', `${currPRowData ? `${currPRowData.name}的数据` : ''}`]}
          layout={[8, 16]}
        >
          <ParentTable slot="left" />
          {this.getRightCmp() || (
            <Empty slot="right" className={cls('empty-wrapper')} description="请选择左边的数据" />
          )}
        </CascadeLayout>
      </PageWrapper>
    );
  }
}

export default MasterDataMaintain;
