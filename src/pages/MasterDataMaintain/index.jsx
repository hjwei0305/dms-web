import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { get } from 'lodash';
import cls from 'classnames';
import { Empty, Button } from 'antd';
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
    const dataStructure = get(currPRowData, 'dataStructure', 'GENERAL');

    if (currPRowData && formUiConfig && tableUiConfig && dataStructure === 'TREE') {
      return (
        <ExtTreePreview
          key={currPRowData.id}
          slot="right"
          treeUiConfig={tableUiConfig}
          dataModelCode={currPRowData.code}
          formUiConfig={formUiConfig}
        />
      );
    }

    if (currPRowData && tableUiConfig && dataStructure === 'GENERAL') {
      return <ChildTable key={currPRowData.id} slot="right" modelUiConfig={modelUiConfig} />;
    }

    if (currPRowData) {
      return (
        <span className={cls('ele-center')} slot="right">
          暂无维护主数据【{currPRowData.name}】相关的可视化配置{' '}
          <Button size="large" type="link" onClick={() => {}}>
            去配置
          </Button>
        </span>
      );
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
