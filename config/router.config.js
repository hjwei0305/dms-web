export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    title: '功能菜单集合',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      { title: '元素管理', path: '/metaData', component: './MetaData' },
      { title: '数据源管理', path: '/dataSource', component: './DataSource' },
      { title: '字段类型管理', path: '/fieldType', component: './FieldType' },
      { title: '模型分类管理', path: '/modelType', component: './ModelType' },
      { title: '数据模型管理', path: '/dataModel', component: './DataModel' },
      { title: '数据模型UI管理', path: '/dataModelUiConfig', component: './DataModelUiConfig' },
    ],
  },
];
