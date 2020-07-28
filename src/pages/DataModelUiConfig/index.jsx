import React, { Component, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty } from "antd";
import PageWrapper from '@/components/PageWrapper';
import CascadeLayout from '@/components/Layout/CascadeLayout';
import ParentTable from './components/ParentTable';
import ChildTable from './components/ChildTable';
import styles from "./index.less";

@withRouter
@connect(({ dataModelUiConfig, loading, }) => ({ dataModelUiConfig, loading, }))
class DataModelUiConfig extends Component {

  render() {
    const { dataModelUiConfig, loading,  } = this.props;
    const { currPRowData, } = dataModelUiConfig;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <CascadeLayout title={['数据模型', `${ currPRowData ? `模型【${currPRowData.name}】的UI配置` : ''}`]} layout={[10, 14]}>
          <ParentTable slot="left" />
          { currPRowData ? (<ChildTable slot="right" />) : (<Empty slot="right" className={cls("empty-wrapper")} description="请选择左边的数据" />)}
        </CascadeLayout>
      </PageWrapper>
    );
  }
}

export default DataModelUiConfig;
