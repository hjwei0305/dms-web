import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Icon, Popconfirm, Button } from 'antd';
import cls from 'classnames';
import { get, isEqual, cloneDeep } from 'lodash';
import { ProLayout, ExtIcon } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import FormEleCfg from './components/FormEleCfg';
import EditForm from './components/FormEleCfg/EditForm';
import FormCfg from './components/FormCfg/new';

const { Header: ProHeader, Content, SiderBar } = ProLayout;

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class FormUiConfig extends Component {
  constructor(props) {
    super(props);
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const formUiConfig = get(uiObj, 'formConfig', {
      showDescIcon: true,
      formItems: [],
    });
    this.state = {
      formUiConfig,
      oldFormUiConfig: cloneDeep(formUiConfig),
      cfgType: '1',
      selectedFormItem: null,
    };
  }

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vFormUiConfig: false,
      },
    });
  };

  handleFormItemChange = formItems => {
    const { formUiConfig = {} } = this.state;
    Object.assign(formUiConfig, { formItems });
    this.setState({
      formUiConfig,
    });
  };

  handleDelFormItem = col => {
    const { formUiConfig = {} } = this.state;
    const { formItems = [] } = formUiConfig;
    const tempFormItems = formItems.filter(item => item[0] !== col[0]);
    Object.assign(formUiConfig, { formItems: tempFormItems });
    this.setState({
      formUiConfig,
    });
  };

  handleEditFormItem = col => {
    const { formUiConfig = {} } = this.state;
    const { formItems = [] } = formUiConfig;

    const tempFormItems = formItems.map(item => {
      if (item[0].code !== col[0].code) {
        return item;
      }
      return col;
    });
    Object.assign(formUiConfig, { formItems: tempFormItems });
    this.setState({
      formUiConfig,
    });
  };

  handleEditTable = props => {
    const { formUiConfig = {} } = this.state;
    Object.assign(formUiConfig, props);
    this.setState({
      formUiConfig,
    });
  };

  handleSave = () => {
    const { dispatch, dataModelUiConfig } = this.props;
    const { modelUiConfig, currPRowData } = dataModelUiConfig;
    const { formUiConfig } = this.state;
    const uiObj = JSON.parse(get(modelUiConfig, 'UI', JSON.stringify({})));
    const data = {
      configData: JSON.stringify(Object.assign(uiObj, { formConfig: formUiConfig })),
      configType: 'UI',
      dataDefinitionId: currPRowData.id,
    };

    this.setState({
      oldFormUiConfig: cloneDeep(formUiConfig),
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
    const { formUiConfig, oldFormUiConfig, cfgType, selectedFormItem } = this.state;
    const canCreateRoot = get(formUiConfig, 'canCreateRoot', false);
    const hasUpdate = !isEqual(formUiConfig, oldFormUiConfig);
    return (
      <PageWrapper loading={loading.global}>
        <ProLayout>
          <ProHeader
            backIcon={
              <>
                {hasUpdate ? (
                  <Popconfirm
                    title="表单配置有更新, 是否保存？"
                    onConfirm={this.handleSave}
                    placement="rightTop"
                    onCancel={this.handleBack}
                    okText="是"
                    cancelText="否"
                  >
                    <span className={cls('back-icon')}>
                      <ExtIcon type="left" antd />
                    </span>
                  </Popconfirm>
                ) : (
                  <span className={cls('back-icon')}>
                    <ExtIcon type="left" onClick={this.handleBack} antd />
                  </span>
                )}
              </>
            }
            style={{ paddingLeft: 0 }}
            gutter={[0, 2]}
            title="UI表单配置"
            subTitle={currPRowData.name}
            onBack={this.handleBack}
            extra={
              <Button onClick={this.handleSave} type="primary">
                保存
              </Button>
            }
          />
          <ProLayout>
            <SiderBar allowCollapse width={240} gutter={[0, 4]}>
              <Menu
                mode="inline"
                selectedKeys={[cfgType]}
                onSelect={({ key: cfgType }) => {
                  this.setState({
                    cfgType,
                  });
                }}
              >
                <Menu.Item key="1">新增表单</Menu.Item>
                <Menu.Item key="2">编辑表单</Menu.Item>
                {canCreateRoot ? <Menu.Item key="3">创建根结点表单</Menu.Item> : null}
              </Menu>
            </SiderBar>
            <ProLayout>
              <ProHeader height={60}>
                <FormCfg
                  editData={formUiConfig}
                  onEditTable={this.handleEditTable}
                  onSave={this.handleSave}
                  dataModel={currPRowData}
                />
              </ProHeader>
              <ProLayout>
                <SiderBar width={200} gutter={[0, 2]}>
                  <FormEleCfg
                    onFormItemChange={this.handleFormItemChange}
                    dataModel={currPRowData}
                    uiConfig={formUiConfig}
                    onDelFormItem={this.handleDelFormItem}
                    onEditFormItem={this.handleEditFormItem}
                    onSelect={selectedFormItem => {
                      this.setState({
                        selectedFormItem,
                      });
                    }}
                  />
                </SiderBar>
                <Content
                  empty={{
                    description: '请选择表单项进行配置',
                  }}
                >
                  {selectedFormItem && (
                    <EditForm
                      onValuesChange={values => {
                        const tempSelectedFormItem = cloneDeep(selectedFormItem);
                        Object.assign(tempSelectedFormItem[cfgType], values);
                        this.setState(
                          {
                            selectedFormItem: tempSelectedFormItem,
                          },
                          () => {
                            this.handleEditFormItem(tempSelectedFormItem);
                          },
                        );
                      }}
                      key={`${selectedFormItem[0].code}${cfgType}`}
                      optKey={cfgType}
                      editData={selectedFormItem}
                      fieldLists={[]}
                    />
                  )}
                </Content>
              </ProLayout>
            </ProLayout>
          </ProLayout>
        </ProLayout>
      </PageWrapper>
    );
  }
}

export default FormUiConfig;
