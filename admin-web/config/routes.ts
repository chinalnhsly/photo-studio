export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: 'user/login' },
      { path: '/user', redirect: '/user/login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: 'dashboard' },
      // 预约管理路由
      {
        path: '/booking',
        name: '预约管理',
        routes: [
          { path: '/booking/list', component: 'booking/BookingList', name: '预约列表' },
          { path: '/booking/calendar', component: 'booking/BookingCalendar', name: '预约日历' },
        ],
      },
      // 摄影师管理路由
      {
        path: '/photographer',
        name: '摄影师管理',
        routes: [
          { path: '/photographer/list', component: 'photographer/PhotographerList', name: '摄影师列表' },
          { path: '/photographer/detail/:id', component: 'photographer/PhotographerDetail', name: '摄影师详情', hideInMenu: true },
        ],
      },
      // 工作室管理路由
      {
        path: '/studio',
        name: '工作室管理',
        routes: [
          { path: '/studio/list', component: 'studio/StudioList', name: '工作室列表' },
          { path: '/studio/detail/:id', component: 'studio/StudioDetail', name: '工作室详情', hideInMenu: true },
        ],
      },
      // 客户管理路由
      {
        path: '/customer',
        name: '客户管理',
        routes: [
          { path: '/customer/list', component: 'customer/CustomerList', name: '客户列表' },
        ],
      },
      // 套餐管理路由
      {
        path: '/package',
        name: '套餐管理',
        routes: [
          { path: '/package/list', component: 'package/PackageList', name: '套餐列表' },
          { path: '/package/create', component: 'package/PackageEdit', name: '创建套餐', hideInMenu: true },
          { path: '/package/edit/:id', component: 'package/PackageEdit', name: '编辑套餐', hideInMenu: true },
          { path: '/package/detail/:id', component: 'package/PackageDetail', name: '套餐详情', hideInMenu: true },
        ],
      },
      // 订单管理路由
      {
        path: '/order',
        name: '订单管理',
        routes: [
          { path: '/order/list', component: 'order/OrderList', name: '订单列表' },
          { path: '/order/detail/:id', component: 'order/OrderDetail', name: '订单详情', hideInMenu: true },
        ],
      },
      // 员工管理路由
      {
        path: '/employee',
        name: '员工管理',
        routes: [
          { path: '/employee/list', component: 'employee/EmployeeList', name: '员工列表' },
          { path: '/employee/create', component: 'employee/EmployeeEdit', name: '创建员工', hideInMenu: true },
          { path: '/employee/edit/:id', component: 'employee/EmployeeEdit', name: '编辑员工', hideInMenu: true },
          { path: '/employee/detail/:id', component: 'employee/EmployeeDetail', name: '员工详情', hideInMenu: true },
        ],
      },
      // 统计分析路由
      {
        path: '/analytics',
        name: '统计分析',
        routes: [
          { path: '/analytics/sales', component: 'analytics/SalesAnalytics', name: '销售统计' },
          { path: '/analytics/customers', component: 'analytics/CustomerAnalytics', name: '客户分析', hideInMenu: true },
        ],
      },
      // 图片库管理路由
      {
        path: '/gallery',
        name: '图片库',
        routes: [
          { path: '/gallery/photos', component: 'gallery/PhotoGallery', name: '图片管理' },
          { path: '/gallery/categories', component: 'gallery/CategoryManagement', name: '分类管理', hideInMenu: true },
        ],
      },
      // 系统设置
      {
        path: '/settings',
        name: '系统设置',
        routes: [
          { path: '/settings/basic', component: 'settings/BasicSettings', name: '基础设置' },
          { path: '/settings/roles', component: 'settings/RoleSettings', name: '角色权限', hideInMenu: true },
        ],
      },
      { 
        component: './404', 
      },
    ],
  },
  { 
    component: './404',
  },
];
