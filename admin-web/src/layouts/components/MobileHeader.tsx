import React, { useState } from 'react';
import { Layout, Button, Drawer, Avatar, Menu, Dropdown } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
// 从 redux 拿全局用户信息
import { useSelector } from 'react-redux';
// 导入兼容层 history
import { history } from '../../utils/compatibility';
import './MobileHeader.less';

const { Header } = Layout;

// 用户信息类型
interface UserInfo {
  avatar?: string;
  name?: string;
  title?: string;
}

interface MobileHeaderProps {
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  title?: string;
  menuData?: any[];
  onMenuClick?: (key: string) => void;
  selectedKeys?: string[];
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  collapsible = true,
  collapsed = false,
  onCollapse,
  title,
  menuData = [],
  onMenuClick,
  selectedKeys = [],
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  // 从全局 state.global.userInfo 中读取
  const currentUser: UserInfo = useSelector((state: any) => state.global.userInfo) || {};

  const toggleDrawer = () => setDrawerVisible(v => !v);
  const handleMenuClick = (key: string) => {
    setDrawerVisible(false);
    onMenuClick?.(key);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/user/login');
  };

  // 定义用户下拉菜单项
  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
    { key: 'settings', icon: <SettingOutlined />, label: '个人设置' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
  ];

  // 将原 menuData 转成 items 结构
  // Define interfaces for menu data structure
  interface SubMenuItem {
    key: string;
    icon?: React.ReactNode;
    title: string;
  }

  interface MenuItem {
    key: string;
    icon?: React.ReactNode;
    title: string;
    children?: SubMenuItem[];
  }

  const menuItems: MenuProps['items'] = menuData.map((item: MenuItem) => ({
    key: item.key,
    icon: item.icon,
    label: item.title,
    children: item.children?.map((sub: SubMenuItem) => ({
      key: sub.key,
      icon: sub.icon,
      label: sub.title,
    })),
  }));

  return (
    <>
      <Header className="mobile-header">
        <div className="header-left">
          {collapsible && (
            <Button type="text" icon={<MenuOutlined />} onClick={toggleDrawer} />
          )}
          <div className="header-title">{title}</div>
        </div>
        <div className="header-right">
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
            <Avatar size="small" icon={<UserOutlined />} src={currentUser.avatar} />
          </Dropdown>
        </div>
      </Header>

      <Drawer
        title={title}
        placement="left"
        closable
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <div className="user-info">
          <Avatar size={64} icon={<UserOutlined />} src={currentUser.avatar} />
          <div className="user-name">{currentUser.name || '用户'}</div>
          <div className="user-role">{currentUser.title || '角色未知'}</div>
        </div>
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={selectedKeys}
          items={menuItems}
        />
      </Drawer>
    </>
  );
};

export default MobileHeader;
