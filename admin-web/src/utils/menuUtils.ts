import React from 'react';
import { MenuProps } from 'antd';
import { Link } from 'umi';
import {
  CalendarOutlined,
  UserOutlined,
  ShopOutlined,
  TeamOutlined,
  SolutionOutlined,
  SettingOutlined,
  PictureOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

// icon 字符串到组件的映射（用 React.createElement 避免类型推断问题）
const iconMap: Record<string, React.ReactNode> = {
  CalendarOutlined: React.createElement(CalendarOutlined),
  UserOutlined: React.createElement(UserOutlined),
  ShopOutlined: React.createElement(ShopOutlined),
  TeamOutlined: React.createElement(TeamOutlined),
  SolutionOutlined: React.createElement(SolutionOutlined),
  SettingOutlined: React.createElement(SettingOutlined),
  PictureOutlined: React.createElement(PictureOutlined),
  BarChartOutlined: React.createElement(BarChartOutlined),
  FileTextOutlined: React.createElement(FileTextOutlined),
};

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
      // 修正路径拼接逻辑，避免重复
      let path = route.path.startsWith('/')
        ? route.path
        : parentPath
        ? `${parentPath.replace(/\/$/, '')}/${route.path.replace(/^\//, '')}`
        : route.path;

      // 将 icon 字符串转为组件
      const icon = typeof route.icon === 'string' ? iconMap[route.icon] : route.icon;

      // 如果有子路由并且不是隐藏菜单
      if (route.routes && route.routes.some((r: any) => r.name && !r.hideInMenu)) {
        return getItem(
          route.name,
          path,
          icon,
          routesToMenuItems(route.routes, path),
        );
      }

      // 没有子路由或者子路由都隐藏
      return getItem(
        React.createElement(Link, { to: path }, route.name),
        path,
        icon,
      );
    });
}
