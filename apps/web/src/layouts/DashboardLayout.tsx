import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

// 确保菜单项的键与路由完全匹配
const menuItems: MenuProps['items'] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'products',
    icon: <ShoppingOutlined />,
    label: '商品管理',
    children: [
      {
        key: 'product-list', // 确保路由匹配
        label: '商品列表',
      },
      {
        key: 'categories',
        label: '分类管理',
      },
    ],
  },
  {
    key: 'users',
    icon: <UserOutlined />,
    label: '用户管理',
  },
  {
    key: 'bookings',
    icon: <CalendarOutlined />,
    label: '预约管理',
  },
];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 获取当前路径
  const currentPath = location.pathname.split('/')[1] || 'dashboard';
  
  console.log('当前路径:', location.pathname, '选中菜单:', currentPath);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontWeight: 'bold' }}>影楼管理系统</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentPath]}
          defaultOpenKeys={['products']}
          items={menuItems}
          onClick={({ key }) => {
            console.log('导航到:', key);
            navigate(`/${key}`);
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
