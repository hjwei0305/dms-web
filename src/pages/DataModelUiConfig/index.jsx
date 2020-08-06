import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import CascadeLayout from '@/components/Layout/CascadeLayout';
import ParentTable from './components/ParentTable';
import UiConfigPreview from './components/UiConfigPreview';
import TableUiConfig from './components/TableUiConfig';
import FormConfig from './components/FormConfig';
import styles from './index.less';

@withRouter
@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class DataModelUiConfig extends Component {
  render() {
    const { dataModelUiConfig, loading } = this.props;
    const { currPRowData, vTableUiConfig, vFormUiConfig, modelUiConfig } = dataModelUiConfig;

    return (
      <>
        <PageWrapper
          loading={loading.global}
          className={cls({
            [styles['container-box']]: true,
            hide_ele: vTableUiConfig || vFormUiConfig,
          })}
        >
          <CascadeLayout
            title={[
              '数据模型',
              `${currPRowData ? `模型【${currPRowData.tableName}】的UI配置预览` : ''}`,
            ]}
            layout={[10, 14]}
          >
            <ParentTable slot="left" />
            {currPRowData && modelUiConfig ? (
              <UiConfigPreview modelUiConfig={modelUiConfig} slot="right" />
            ) : (
              <Empty slot="right" className={cls('empty-wrapper')} description="请选择左边的数据" />
            )}
          </CascadeLayout>
        </PageWrapper>
        {vTableUiConfig ? <TableUiConfig /> : null}
        {vFormUiConfig ? <FormConfig /> : null}
      </>
    );
  }
}

export default DataModelUiConfig;
