import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { ProLayout } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import ParentTable from './components/ParentTable';
import TableDesigner from './TableDesigner';

const { Header, Content, SiderBar } = ProLayout;

@withRouter
@connect(({ designer, loading }) => ({ designer, loading }))
class Designer extends Component {
  handleSave = async values => {
    const { designer } = this.props;
    const { currPRowData, modelUiConfig } = designer;

    // return {};
    const data = {
      configData: JSON.stringify(values),
      configType: 'UI',
      dataDefinitionId: currPRowData.id,
    };
    return dispatch({
      type: 'dataModelUiConfig/saveModelUiConfig',
      payload: {
        modelUiConfig,
        data,
      },
    });
  };

  render() {
    const { designer, loading } = this.props;
    const {
      currPRowData,
      vTableUiConfig,
      vFormUiConfig,
      modelUiConfig,
      vExportUiConfig,
      vImportUiConfig,
      vFilterFormConfig,
    } = designer;

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
              <ProLayout>
                <Header title="主数据" />
                <Content>
                  <ParentTable />
                </Content>
              </ProLayout>
            </SiderBar>
            <ProLayout>
              <Content
                empty={{
                  description:
                    currPRowData && currPRowData.customize
                      ? '定制页面，不用进行配置'
                      : '请选择左边的数据',
                }}
              >
                {currPRowData && !currPRowData.customize && modelUiConfig && (
                  <TableDesigner
                    parentData={currPRowData}
                    uiConfig={modelUiConfig}
                    onSave={this.handleSave}
                  />
                )}
              </Content>
            </ProLayout>
          </ProLayout>
        </PageWrapper>
      </>
    );
  }
}

export default Designer;
