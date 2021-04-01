import React, { Component } from 'react';
import { connect } from 'dva';
import { ProLayout, ExtIcon } from 'suid';
import { Popconfirm, Button } from 'antd';
import { get, cloneDeep, isEqual } from 'lodash';
import PageWrapper from '@/components/PageWrapper';
import { constants } from '@/utils';
import ExtTablePreview from '@/components/ExtTablePreview';
import TableColCfg from './components/TableColCfg';
import EditColForm from './components/TableColCfg/form';
import TableCfg from './components/TableCfg';

const { MDMSCONTEXT } = constants;
const { Header: ProHeader, Content, SiderBar } = ProLayout;

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class TableUiConfig extends Component {
  constructor(props) {
    super(props);
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const tableUiConfig = get(uiObj, 'showConfig', {
      store: {
        type: 'POST',
        url: '',
      },
      showSearchTooltip: true,
      allowCustomColumns: true,
      remotePaging: true,
      columns: [],
    });
    this.state = {
      tableUiConfig,
      oldTableUiConfig: cloneDeep(tableUiConfig),
      selectedColItem: null,
    };
  }

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vTableUiConfig: false,
      },
    });
  };

  handleColChange = columns => {
    const { tableUiConfig = {} } = this.state;
    Object.assign(tableUiConfig, { columns });
    this.setState({
      tableUiConfig,
    });
  };

  handleDelCol = col => {
    const { tableUiConfig = {} } = this.state;
    const { columns = [] } = tableUiConfig;
    const tempColumns = columns.filter(item => item.dataIndex !== col.dataIndex);
    Object.assign(tableUiConfig, { columns: tempColumns });
    this.setState({
      tableUiConfig,
    });
  };

  handleEditCol = col => {
    const { tableUiConfig = {} } = this.state;
    const { columns = [] } = tableUiConfig;

    const tempColumns = columns.map(item => {
      if (item.dataIndex !== col.dataIndex) {
        return item;
      }
      return col;
    });
    Object.assign(tableUiConfig, { columns: tempColumns });
    this.setState({
      tableUiConfig,
    });
  };

  handleEditTable = props => {
    const { tableUiConfig = {} } = this.state;

    Object.assign(tableUiConfig, props);
    this.setState({
      tableUiConfig,
    });
  };

  handleSave = () => {
    const { dispatch, dataModelUiConfig } = this.props;
    const { modelUiConfig = {}, currPRowData } = dataModelUiConfig;
    const { tableUiConfig = {} } = this.state;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const data = {
      configData: JSON.stringify(Object.assign(uiObj, { showConfig: tableUiConfig })),
      configType: 'UI',
      dataDefinitionId: currPRowData.id,
    };

    this.setState({
      oldTableUiConfig: cloneDeep(tableUiConfig),
    });

    dispatch({
      type: 'dataModelUiConfig/saveModelUiConfig',
      payload: {
        modelUiConfig: Object.assign(modelUiConfig, { UI: data.configData }),
        data,
      },
    });
  };

  render() {
    const { dataModelUiConfig, loading } = this.props;
    const { currPRowData } = dataModelUiConfig;
    const { tableUiConfig, oldTableUiConfig, selectedColItem } = this.state;
    const hasUpdate = !isEqual(tableUiConfig, oldTableUiConfig);

    return (
      <PageWrapper loading={loading.global}>
        <ProLayout>
          <ProHeader
            style={{ paddingLeft: 0 }}
            gutter={[0, 4]}
            title="UI列表配置"
            subTitle={currPRowData.name}
            onBack={this.handleBack}
            backIcon={
              hasUpdate ? (
                <Popconfirm
                  title="列表配置有更新, 是否保存？"
                  onConfirm={this.handleSave}
                  placement="rightTop"
                  onCancel={this.handleBack}
                  okText="是"
                  cancelText="否"
                >
                  <ExtIcon type="left" antd />
                </Popconfirm>
              ) : (
                <ExtIcon type="left" onClick={this.handleBack} antd />
              )
            }
            extra={
              <Button type="primary" onClick={this.handleSave}>
                保存
              </Button>
            }
          />
          <ProHeader gutter={[0, 4]}>
            <TableCfg
              editData={tableUiConfig}
              dataModel={currPRowData}
              onEditTable={this.handleEditTable}
            />
          </ProHeader>
          <ProLayout>
            <SiderBar allowCollapse width={200} gutter={[0, 4]}>
              <TableColCfg
                onColChange={this.handleColChange}
                dataModel={currPRowData}
                tableUiConfig={tableUiConfig}
                onDelCol={this.handleDelCol}
                onEditCol={this.handleEditCol}
                onSelect={selectedColItem => {
                  this.setState({
                    selectedColItem,
                  });
                }}
              />
            </SiderBar>
            <SiderBar width={250} gutter={[0, 4]}>
              <ProLayout>
                <ProHeader
                  height={47}
                  title="列属性"
                  subTitle={selectedColItem && selectedColItem.title}
                />
                <Content
                  empty={{
                    description: '请选择已配置列进行属性配置',
                  }}
                >
                  {selectedColItem && (
                    <EditColForm
                      editData={selectedColItem}
                      onValuesChange={values => {
                        this.handleEditCol(Object.assign({}, selectedColItem, values));
                      }}
                    />
                  )}
                </Content>
              </ProLayout>
            </SiderBar>
            <ProLayout>
              <ProHeader height={47} title="实时预览" />
              <Content>
                <ExtTablePreview
                  key={JSON.stringify(tableUiConfig)}
                  tableUiConfig={tableUiConfig}
                  store={{
                    type: 'POST',
                    url: `${MDMSCONTEXT}/${currPRowData.code}/findByPage`,
                  }}
                />
              </Content>
            </ProLayout>
          </ProLayout>
        </ProLayout>
      </PageWrapper>
    );
  }
}

export default TableUiConfig;
