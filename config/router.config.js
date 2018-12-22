export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/monitor' },
      {
        path: '/monitor',
        name: 'monitor',
        icon: 'dashboard',
        component: './Monitor',
      },
      // forms
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          { path: '/list', redirect: '/list/well-list' },
          {
            path: '/list/well-list',
            name: 'wellList',
            component: './List/WellList',
          },
          {
            path: '/list/owner-list',
            name: 'ownerList',
            component: './List/OwnerList',
          },
          {
            path: '/list/sim-list',
            name: 'simList',
            component: './List/SimList',
          },
          {
            path: '/list/device-list',
            name: 'deviceList',
            component: './List/DeviceList',
          },
        ],
      },
      // list
      {
        path: '/warning',
        icon: 'warning',
        name: 'warning',
        component: './Warning',
      },
      {
        path: '/maintenance',
        icon: 'form',
        name: 'maintenance',
        component: './Maintenance',
      },
      {
        path: '/accountmanagement',
        icon: 'user',
        name: 'accountmanagement',
        component: './AccountManagement',
      },

      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
