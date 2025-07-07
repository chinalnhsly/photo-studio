// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/home/liyong/photostudio/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/user",
    "layout": false,
    "routes": [
      {
        "path": "/user/login",
        "component": require('/home/liyong/photostudio/admin-web/src/pages/user/login').default,
        "exact": true
      },
      {
        "path": "/user",
        "redirect": "/user/login",
        "exact": true
      }
    ]
  },
  {
    "path": "/",
    "component": require('/home/liyong/photostudio/admin-web/src/layouts/BasicLayout').default,
    "routes": [
      {
        "path": "/",
        "redirect": "/dashboard",
        "exact": true
      },
      {
        "path": "/dashboard",
        "component": require('/home/liyong/photostudio/admin-web/src/pages/dashboard').default,
        "exact": true
      },
      {
        "path": "/booking",
        "name": "预约管理",
        "icon": "CalendarOutlined",
        "routes": [
          {
            "path": "/booking",
            "redirect": "/booking/list",
            "exact": true
          },
          {
            "path": "/booking/list",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/booking/BookingList').default,
            "name": "预约列表",
            "exact": true
          },
          {
            "path": "/booking/calendar",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/booking/BookingCalendar').default,
            "name": "预约日历",
            "exact": true
          },
          {
            "path": "/booking/create",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/booking/BookingForm').default,
            "name": "新建预约",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/booking/edit/:id",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/booking/BookingForm').default,
            "name": "编辑预约",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/booking/detail/:id",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/booking/BookingDetail').default,
            "name": "预约详情",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/booking/analytics",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/booking/BookingAnalytics').default,
            "name": "预约分析",
            "exact": true
          }
        ]
      },
      {
        "path": "/photographer",
        "name": "摄影师管理",
        "routes": [
          {
            "path": "/photographer/list",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/photographer/PhotographerList').default,
            "name": "摄影师列表",
            "exact": true
          },
          {
            "path": "/photographer/detail/:id",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/photographer/PhotographerDetail').default,
            "name": "摄影师详情",
            "hideInMenu": true,
            "exact": true
          }
        ]
      },
      {
        "path": "/studio",
        "name": "工作室管理",
        "routes": [
          {
            "path": "/studio/list",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/studio/StudioList').default,
            "name": "工作室列表",
            "exact": true
          },
          {
            "path": "/studio/detail/:id",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/studio/StudioDetail').default,
            "name": "工作室详情",
            "hideInMenu": true,
            "exact": true
          }
        ]
      },
      {
        "path": "/customer",
        "name": "客户管理",
        "routes": [
          {
            "path": "/customer/list",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/customer/CustomerList').default,
            "name": "客户列表",
            "exact": true
          }
        ]
      },
      {
        "path": "/package",
        "name": "套餐管理",
        "routes": [
          {
            "path": "/package/list",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/package/PackageList').default,
            "name": "套餐列表",
            "exact": true
          },
          {
            "path": "/package/create",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/package/PackageEdit').default,
            "name": "创建套餐",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/package/edit/:id",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/package/PackageEdit').default,
            "name": "编辑套餐",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/package/detail/:id",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/package/PackageDetail').default,
            "name": "套餐详情",
            "hideInMenu": true,
            "exact": true
          }
        ]
      },
      {
        "path": "/order",
        "name": "订单管理",
        "routes": [
          {
            "path": "/order/list",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/order/OrderList').default,
            "name": "订单列表",
            "exact": true
          },
          {
            "path": "/order/detail/:id",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/order/OrderDetail').default,
            "name": "订单详情",
            "hideInMenu": true,
            "exact": true
          }
        ]
      },
      {
        "path": "/employee",
        "name": "员工管理",
        "routes": [
          {
            "path": "/employee/list",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/employee/EmployeeList').default,
            "name": "员工列表",
            "exact": true
          },
          {
            "path": "/employee/create",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/employee/EmployeeEdit').default,
            "name": "创建员工",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/employee/edit/:id",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/employee/EmployeeEdit').default,
            "name": "编辑员工",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/employee/detail/:id",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/employee/EmployeeDetail').default,
            "name": "员工详情",
            "hideInMenu": true,
            "exact": true
          }
        ]
      },
      {
        "path": "/analytics",
        "name": "统计分析",
        "routes": [
          {
            "path": "/analytics/sales",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/analytics/SalesAnalytics').default,
            "name": "销售统计",
            "exact": true
          },
          {
            "path": "/analytics/customers",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/analytics/CustomerAnalytics').default,
            "name": "客户分析",
            "hideInMenu": true,
            "exact": true
          }
        ]
      },
      {
        "path": "/gallery",
        "name": "图片库",
        "routes": [
          {
            "path": "/gallery/photos",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/gallery/PhotoGallery').default,
            "name": "图片管理",
            "exact": true
          },
          {
            "path": "/gallery/categories",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/gallery/CategoryManagement').default,
            "name": "分类管理",
            "hideInMenu": true,
            "exact": true
          }
        ]
      },
      {
        "path": "/settings",
        "name": "系统设置",
        "routes": [
          {
            "path": "/settings/basic",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/settings/BasicSettings').default,
            "name": "基础设置",
            "exact": true
          },
          {
            "path": "/settings/roles",
            "component": require('/home/liyong/photostudio/admin-web/src/pages/settings/RoleSettings').default,
            "name": "角色权限",
            "hideInMenu": true,
            "exact": true
          }
        ]
      },
      {
        "component": require('/home/liyong/photostudio/admin-web/src/pages/404').default,
        "exact": true
      }
    ]
  },
  {
    "component": require('/home/liyong/photostudio/admin-web/src/pages/404').default,
    "exact": true
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
