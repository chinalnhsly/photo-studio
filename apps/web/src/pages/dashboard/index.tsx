import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content, Sider } = Layout;

const menuItems: MenuProps['items'] = [
  {
    key: '1',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '2',
    icon: <ShoppingCartOutlined />,
    label: '订单管理',
  },
  {
    key: '3',
    icon: <ShopOutlined />,
    label: '产品管理',
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case '1':
        navigate('/dashboard');
        break;
      case '2':
        navigate('/dashboard/orders');
        break;
      case '3':
        navigate('/dashboard/products');
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: '#fff' }}>
        <div className="logo" />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ 
            background: '#fff', 
            padding: 24, 
            margin: 0, 
            minHeight: 280,
            borderRadius: 4
          }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
