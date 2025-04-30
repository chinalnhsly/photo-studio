import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Breadcrumb, Button, Drawer, Badge } from 'antd';
import { Link, useLocation } from 'umi';
import {
  MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined,
  BellOutlined, LogoutOutlined, SettingOutlined, HomeOutlined
} from '@ant-design/icons';
import routes from '../../config/routes';
import { routesToMenuItems } from '../utils/menuUtils';
import './BasicLayout.less';

const { Header, Sider, Content } = Layout;

// 从路由配置中找到当前路径对应的路由项
const findRouteByPath = (routes: any[], path: string): any => {
  let result = null;
  
  const find = (routeList: any[], parentPath = '') => {
    for (const route of routeList) {
      const fullPath = parentPath ? `${parentPath}${route.path}` : route.path;
      
      if (fullPath === path) {
        result = route;
        return;
      }
      
      if (route.routes) {
        find(route.routes, fullPath);
      }
    }
  };
  
  find(routes[1].routes || []);
  return result;
};

// 生成面包屑导航
const generateBreadcrumb = (path: string): React.ReactNode[] => {
  const route = findRouteByPath(routes, path);
  const breadcrumbs = [
    <Breadcrumb.Item key="home">
      <Link to="/"><HomeOutlined /> 主页</Link>
    </Breadcrumb.Item>
  ];
  
  if (route && route.name) {
    breadcrumbs.push(
      <Breadcrumb.Item key={route.path}>
        <Link to={path}>{route.name}</Link>
      </Breadcrumb.Item>
    );
  }
  
  return breadcrumbs;
};

interface BasicLayoutProps {
  children?: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const location = useLocation();
  
  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !collapsed) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 将路由转换为菜单项
  const menuItems = routesToMenuItems(routes[1].routes || []);
  
  // 用户菜单 - 修复使用 items 而不是 overlay
  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">个人中心</Link>,
      icon: <UserOutlined />
    },
    {
      key: 'settings',
      label: <Link to="/settings/basic">系统设置</Link>,
      icon: <SettingOutlined />
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: () => {
        // 处理登出逻辑
        window.location.href = '/user/login';
      }
    }
  ];
  
  // 通知菜单 - 修复使用 items 而不是 overlay
  const notificationItems = [
    {
      key: '1',
      label: '您有 3 条新预约需要处理',
      onClick: () => {}
    },
    {
      key: '2',
      label: '您有 1 个即将开始的拍摄任务',
      onClick: () => {}
    },
    {
      type: 'divider' as const
    },
    {
      key: 'more',
      label: <Link to="/notifications">查看所有通知</Link>,
      onClick: () => {}
    }
  ];
  
  return (
    <Layout className="app-layout">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        className="app-sider"
        collapsedWidth={window.innerWidth < 768 ? 0 : 80}
      >
        <div className="logo">
          {collapsed ? 'PS' : '摄影工作室管理系统'}
        </div>
        
        {/* 修复使用 items 而不是 children */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/').slice(0, 2).join('/')]}
          items={menuItems}
        />
      </Sider>
      
      <Layout className="site-layout">
        <Header className="app-header">
          {window.innerWidth < 768 ? (
            <>
              <Button
                className="menu-mobile-trigger"
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setMobileDrawerVisible(true)}
              />
              
              <Drawer
                title="菜单"
                placement="left"
                closable={true}
                onClose={() => setMobileDrawerVisible(false)}
                visible={mobileDrawerVisible}
                width={200}
              >
                {/* 移动端抽屉中的菜单 - 修复使用 items */}
                <Menu
                  mode="inline"
                  selectedKeys={[location.pathname]}
                  defaultOpenKeys={[location.pathname.split('/').slice(0, 2).join('/')]}
                  items={menuItems}
                  onClick={() => setMobileDrawerVisible(false)}
                />
              </Drawer>
            </>
          ) : (
            <Button
              className="trigger"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          )}
          
          <div className="header-actions">
            {/* 修复使用 menu 而不是 overlay */}
            <Dropdown menu={{ items: notificationItems }}>
              <Badge count={4} className="notification-badge">
                <Button type="text" icon={<BellOutlined />} />
              </Badge>
            </Dropdown>
            
            {/* 修复使用 menu 而不是 overlay */}
            <Dropdown menu={{ items: userMenuItems }}>
              <div className="user-dropdown">
                <Avatar icon={<UserOutlined />} />
                <span className="user-name">管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <div className="app-breadcrumb">
          <Breadcrumb>{generateBreadcrumb(location.pathname)}</Breadcrumb>
        </div>
        
        <Content className="app-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
