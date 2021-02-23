import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty, PageHeader } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import ProLayout, { Header, Center, SiderBar } from '@/components/ProLayout';
// import CascadeLayout from '@/components/Layout/CascadeLayout';
import ParentTable from './components/ParentTable';
import UiConfigPreview from './components/UiConfigPreview';
import TableUiConfig from './components/TableUiConfig';
import FormConfig from './components/FormConfig';
import FilterFormConfig from './components/FilterFormConfig';
import TreeUiConfig from './components/TreeUiConfig';
import ExportUiConfig from './components/ExportUiConfig';
import ImportUiConfig from './components/ImportUiConfig';
import styles from './index.less';

@withRouter
@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class DataModelUiConfig extends Component {
  render() {
    const { dataModelUiConfig, loading } = this.props;
    const {
      currPRowData,
      vTableUiConfig,
      vFormUiConfig,
      modelUiConfig,
      vExportUiConfig,
      vImportUiConfig,
      vFilterFormConfig,
    } = dataModelUiConfig;

    return (
      <>
        <PageWrapper
          loading={loading.global}
          className={cls({
            [styles['container-box']]: true,
            hide_ele:
              vTableUiConfig ||
              vFormUiConfig ||
              vExportUiConfig ||
              vImportUiConfig ||
              vFilterFormConfig,
          })}
        >
          <ProLayout>
            <SiderBar allowCollapse gutter={[0, 8]}>
              <ProLayout layout="column">
                <Header height={60}>
                  <PageHeader title="主数据" />
                </Header>
                <Center>
                  <ParentTable />
                </Center>
              </ProLayout>
            </SiderBar>
            <Center>
              <ProLayout layout="column">
                <Header height={60}>
                  <PageHeader
                    title={`${currPRowData ? `主数据【${currPRowData.name}】的UI配置预览` : ''}`}
                  />
                </Header>
                <Center>
                  {currPRowData && modelUiConfig ? (
                    <UiConfigPreview modelUiConfig={modelUiConfig} />
                  ) : (
                    <Empty className={cls('empty-wrapper')} description="请选择左边的数据" />
                  )}
                </Center>
              </ProLayout>
            </Center>
          </ProLayout>
          {/* <CascadeLayout
            title={[
              '主数据',
              `${currPRowData ? `主数据【${currPRowData.name}】的UI配置预览` : ''}`,
            ]}
            layout={[8, 16]}
            canShrink
          >
            <ParentTable slot="left" />
            {currPRowData && modelUiConfig ? (
              <UiConfigPreview modelUiConfig={modelUiConfig} slot="right" />
            ) : (
              <Empty slot="right" className={cls('empty-wrapper')} description="请选择左边的数据" />
            )}
          </CascadeLayout> */}
        </PageWrapper>
        {vTableUiConfig && currPRowData.dataStructure === 'GENERAL' ? (
          <TableUiConfig modelUiConfig={modelUiConfig} />
        ) : null}
        {vFilterFormConfig && currPRowData.dataStructure === 'GENERAL' ? (
          <FilterFormConfig modelUiConfig={modelUiConfig} />
        ) : null}
        {vTableUiConfig && currPRowData.dataStructure === 'TREE' ? (
          <TreeUiConfig modelUiConfig={modelUiConfig} />
        ) : null}
        {vFormUiConfig ? <FormConfig modelUiConfig={modelUiConfig} /> : null}

        {vExportUiConfig ? <ExportUiConfig modelUiConfig={modelUiConfig} /> : null}

        {vImportUiConfig ? <ImportUiConfig modelUiConfig={modelUiConfig} /> : null}
      </>
    );
  }
}

export default DataModelUiConfig;
