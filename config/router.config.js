export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    title: '用户登录',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { title: '登录', path: '/user/login', component: './Login' },
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
      { title: '数据模型管理', path: '/dataModel', component: './DataModelManager' },
      { title: '主数据注册', path: '/masterDataRegister', component: './MasterDataRegister' },
      { title: '数据模型UI管理', path: '/dataModelUiConfig', component: './DataModelUiConfig' },
      { title: '主数据维护', path: '/masterDataMaintain', component: './MasterDataMaintain' },
      { title: '主数据分享', path: '/dataShare', component: './DataShare' },
      { title: '主数据分享关系图', path: '/dataSharedDiagram', component: './DataSharedDiagram' },
      { title: '大文件上传', path: '/largeFileUpload', component: './LargeFileUpload' },
      { title: '数据字典', path: '/dataDict', component: './PageWidget/DataDict' },
    ],
  },
];
