import { Layout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white' }}>影楼管理系统</Header>
      <Layout>
        <Sider>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">工作台</Menu.Item>
            <Menu.Item key="2">预约管理</Menu.Item>
            <Menu.Item key="3">客户管理</Menu.Item>
          </Menu>
        </Sider>
        <Content className="page-container">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
