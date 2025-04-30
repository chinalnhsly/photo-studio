import React from 'react';
import { MenuProps } from 'antd';
import { Link } from 'umi';

type MenuItem = Required<MenuProps>['items'][number];

/**
 * 获取菜单项 - 用于 antd v4 兼容 Menu 组件的 items 写法
 * @param label 菜单标签
 * @param key 菜单键值
 * @param icon 菜单图标
 * @param children 子菜单
 * @param type 菜单类型
 * @returns MenuItem 对象
 */
export function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

/**
 * 将路由配置转换为菜单项
 * @param routes 路由配置
 * @param parentPath 父路径
 * @returns 菜单项数组
 */
export function routesToMenuItems(routes: any[], parentPath = ''): MenuItem[] {
  return routes
    .filter(route => route.name && !route.hideInMenu)
    .map(route => {
      const path = parentPath ? `${parentPath}${route.path}` : route.path;
      
      // 如果有子路由并且不是隐藏菜单
      if (route.routes && route.routes.some((r: any) => r.name && !r.hideInMenu)) {
        return getItem(
          route.name,
          path,
          route.icon,
          routesToMenuItems(route.routes, path),
        );
      }
      
      // 没有子路由或者子路由都隐藏
      return getItem(
        React.createElement(Link, { to: path }, route.name),
        path,
        route.icon,
      );
    });
}
