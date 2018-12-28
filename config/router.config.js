export default [
  // user
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/login', redirect: '/login/page' },
      { path: '/login/page', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['superAdmin', 'Admin', 'Operation', 'User'],
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
        path: '/wellmanagement',
        icon: 'sliders',
        name: 'wellmanagement',
        routes: [
          { path: '/wellmanagement', redirect: '/wellmanagement/welllist' },
          {
            path: '/wellmanagement/welllist',
            name: 'welllist',
            component: './WellManagement/WellList',
          },
          {
            path: '/wellmanagement/ownerlist',
            name: 'ownerlist',
            component: './WellManagement/OwnerList',
          },
          {
            path: '/wellmanagement/wellprofile',
            name: 'wellprofile',
            hideInMenu: true,
            component: './WellManagement/WellProfile',
          },
        ],
      },
      {
        path: '/devicemanagement',
        icon: 'sliders',
        name: 'devicemanagement',
        routes: [
          { path: '/devicemanagement', redirect: '/devicemanagement/devicelist' },
          {
            path: '/devicemanagement/devicelist',
            name: 'devicelist',
            component: './DeviceManagement/DeviceList',
          },
          {
            path: '/devicemanagement/simlist',
            name: 'simlist',
            component: './DeviceManagement/SimList',
          },
          {
            path: '/devicemanagement/deviceprofile',
            name: 'deviceprofile',
            hideInMenu: true,
            component: './DeviceManagement/DeviceProfile',
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
        path: '/maintenance/maintenanceprofile',
        name: 'maintenanceprofile',
        hideInMenu: true,
        component: './Maintenance/MaintenanceProfile',

      },
      {
        path: '/accountmanagement',
        icon: 'user',
        name: 'accountmanagement',
        authority: ['superAdmin'],
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
