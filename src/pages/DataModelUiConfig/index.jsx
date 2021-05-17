import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { ProLayout } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import ParentTable from './components/ParentTable';
import UiConfigPreview from './components/UiConfigPreview';
import TableUiConfig from './components/TableUiConfig';
import FormConfig from './components/FormConfig/new';
import FilterFormConfig from './components/FilterFormConfig';
// import ExportUiConfig from './components/ExportUiConfig';
// import ImportUiConfig from './components/ImportUiConfig';

const { Header, Content, SiderBar } = ProLayout;

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
            hide_ele:
              vTableUiConfig ||
              vFormUiConfig ||
              vExportUiConfig ||
              vImportUiConfig ||
              vFilterFormConfig,
          })}
        >
          <ProLayout>
            <SiderBar width={350} allowCollapse gutter={[0, 4]}>
              <ProLayout layout="column">
                <Header title="主数据" />
                <Content>
                  <ParentTable />
                </Content>
              </ProLayout>
            </SiderBar>
            <ProLayout layout="column">
              <Header
                title="主数据UI配置预览"
                subTitle={`${currPRowData ? currPRowData.name : ''}`}
              />
              <Content
                empty={{
                  description:
                    currPRowData && currPRowData.customize
                      ? '定制页面，不用进行ui配置'
                      : '请选择左边的数据',
                }}
              >
                {currPRowData && !currPRowData.customize && modelUiConfig && (
                  <UiConfigPreview modelUiConfig={modelUiConfig} />
                )}
              </Content>
            </ProLayout>
          </ProLayout>
        </PageWrapper>
        {vTableUiConfig ? <TableUiConfig modelUiConfig={modelUiConfig} /> : null}
        {vFilterFormConfig && currPRowData.dataStructure === 'GENERAL' ? (
          <FilterFormConfig modelUiConfig={modelUiConfig} />
        ) : null}
        {/* {vTableUiConfig && currPRowData.dataStructure === 'TREE' ? (
          <TableUiConfig modelUiConfig={modelUiConfig} />
        ) : null} */}
        {vFormUiConfig ? <FormConfig modelUiConfig={modelUiConfig} /> : null}

        {/* {vExportUiConfig ? <ExportUiConfig modelUiConfig={modelUiConfig} /> : null}

        {vImportUiConfig ? <ImportUiConfig modelUiConfig={modelUiConfig} /> : null} */}
      </>
    );
  }
}

export default DataModelUiConfig;
