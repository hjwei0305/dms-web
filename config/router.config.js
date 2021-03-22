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
      { title: '主数据注册', path: '/masterDataRegister', component: './MasterDataRegister' },
      { title: '数据模型UI管理', path: '/dataModelUiConfig', component: './DataModelUiConfig' },
      { title: '主数据维护', path: '/masterDataMaintain', component: './MasterDataMaintain' },
      { title: '主数据分享', path: '/dataShare', component: './DataShare' },
      { title: '主数据分享关系图', path: '/dataSharedDiagram', component: './DataSharedDiagram' },
      { title: '数据字典', path: '/dataDict', component: './PageWidget/DataDict' },
      {
        path: '/language',
        title: '语言类型',
        component: './Language',
      },
      {
        path: '/semanteme',
        title: '译文',
        component: './Semanteme',
      },
    ],
  },
];
