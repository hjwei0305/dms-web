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
      { title: '标签库管理', path: '/labelLibrary', component: './LabelLibrary' },
      { title: '元素库管理', path: '/elementLibrary', component: './ElementLibrary' },
      { title: '数据类型管理', path: '/DataType', component: './DataType' },
      { title: '数据源管理', path: '/dataSource', component: './DataSource' },
      { title: '数据模型分类管理', path: '/dataModelType', component: './DataModelType' },
      { title: '数据模型管理', path: '/dataModel', component: './DataModel' },
      { title: '数据模型UI管理', path: '/dataModelUiConfig', component: './DataModelUiConfig' },
    ],
  },
];
