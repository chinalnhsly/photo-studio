import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Tag, Modal, Form, 
  Input, message, Spin, Badge, Switch, Popconfirm 
} from 'antd';
import Tree from 'antd/es/tree';
import DirectoryTree from 'antd/es/tree/DirectoryTree';

import { 
  PlusOutlined, EditOutlined, DeleteOutlined,
  LockOutlined, UnlockOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import './RoleSettings.less';

// 角色列表数据类型
interface RoleItem {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  status: 'active' | 'disabled';
  isSystem: boolean;
  createdAt: string;
}

// 定义角色状态类型
type RoleStatus = 'active' | 'disabled';

// 权限树数据结构
interface PermissionTree {
  title: string;
  key: string;
  children?: PermissionTree[];
}

// 生成完整权限树
const getPermissionTree = (): PermissionTree[] => {
  return [
    {
      title: '仪表盘',
      key: 'dashboard',
      children: [
        {
          title: '查看数据概览',
          key: 'dashboard.view',
        },
        {
          title: '导出报表',
          key: 'dashboard.export',
        },
      ],
    },
    {
      title: '预约管理',
      key: 'booking',
      children: [
        {
          title: '查看预约',
          key: 'booking.view',
        },
        {
          title: '创建预约',
          key: 'booking.create',
        },
        {
          title: '编辑预约',
          key: 'booking.edit',
        },
        {
          title: '删除预约',
          key: 'booking.delete',
        },
      ],
    },
    {
      title: '客户管理',
      key: 'customer',
      children: [
        {
          title: '查看客户',
          key: 'customer.view',
        },
        {
          title: '创建客户',
          key: 'customer.create',
        },
        {
          title: '编辑客户',
          key: 'customer.edit',
        },
        {
          title: '删除客户',
          key: 'customer.delete',
        },
      ],
    },
    {
      title: '摄影师管理',
      key: 'photographer',
      children: [
        {
          title: '查看摄影师',
          key: 'photographer.view',
        },
        {
          title: '创建摄影师',
          key: 'photographer.create',
        },
        {
          title: '编辑摄影师',
          key: 'photographer.edit',
        },
        {
          title: '删除摄影师',
          key: 'photographer.delete',
        },
      ],
    },
    {
      title: '套餐管理',
      key: 'package',
      children: [
        {
          title: '查看套餐',
          key: 'package.view',
        },
        {
          title: '创建套餐',
          key: 'package.create',
        },
        {
          title: '编辑套餐',
          key: 'package.edit',
        },
        {
          title: '删除套餐',
          key: 'package.delete',
        },
      ],
    },
    {
      title: '订单管理',
      key: 'order',
      children: [
        {
          title: '查看订单',
          key: 'order.view',
        },
        {
          title: '创建订单',
          key: 'order.create',
        },
        {
          title: '编辑订单',
          key: 'order.edit',
        },
        {
          title: '删除订单',
          key: 'order.delete',
        },
      ],
    },
    {
      title: '员工管理',
      key: 'employee',
      children: [
        {
          title: '查看员工',
          key: 'employee.view',
        },
        {
          title: '创建员工',
          key: 'employee.create',
        },
        {
          title: '编辑员工',
          key: 'employee.edit',
        },
        {
          title: '删除员工',
          key: 'employee.delete',
        },
      ],
    },
    {
      title: '数据分析',
      key: 'analytics',
      children: [
        {
          title: '查看销售统计',
          key: 'analytics.sales',
        },
        {
          title: '查看客户分析',
          key: 'analytics.customer',
        },
        {
          title: '导出报表',
          key: 'analytics.export',
        },
      ],
    },
    {
      title: '图片管理',
      key: 'gallery',
      children: [
        {
          title: '查看图片',
          key: 'gallery.view',
        },
        {
          title: '上传图片',
          key: 'gallery.upload',
        },
        {
          title: '编辑图片',
          key: 'gallery.edit',
        },
        {
          title: '删除图片',
          key: 'gallery.delete',
        },
        {
          title: '管理分类',
          key: 'gallery.categories',
        },
      ],
    },
    {
      title: '系统设置',
      key: 'settings',
      children: [
        {
          title: '基础设置',
          key: 'settings.basic',
        },
        {
          title: '角色管理',
          key: 'settings.roles',
        },
      ],
    },
  ];
};

// 示例角色数据
const mockRoles: RoleItem[] = [
  {
    id: 1,
    name: '超级管理员',
    description: '拥有系统所有权限',
    permissions: ['*'],
    userCount: 2,
    status: 'active',
    isSystem: true,
    createdAt: '2023-01-01 10:00:00',
  },
  {
    id: 2,
    name: '摄影师',
    description: '摄影师角色，可处理预约和图片',
    permissions: [
      'dashboard.view',
      'booking.view', 'booking.create', 'booking.edit',
      'gallery.view', 'gallery.upload', 'gallery.edit',
      'customer.view',
    ],
    userCount: 8,
    status: 'active',
    isSystem: true,
    createdAt: '2023-01-02 11:30:00',
  },
  {
    id: 3,
    name: '前台',
    description: '前台接待角色，管理客户和预约',
    permissions: [
      'dashboard.view',
      'booking.view', 'booking.create', 'booking.edit',
      'customer.view', 'customer.create', 'customer.edit',
      'order.view', 'order.create',
    ],
    userCount: 4,
    status: 'active',
    isSystem: true,
    createdAt: '2023-01-03 14:20:00',
  },
  {
    id: 4,
    name: '财务',
    description: '财务角色，查看订单和财务报表',
    permissions: [
      'dashboard.view', 'dashboard.export',
      'order.view',
      'analytics.sales', 'analytics.export',
    ],
    userCount: 2,
    status: 'active',
    isSystem: false,
    createdAt: '2023-02-15 09:45:00',
  },
  {
    id: 5,
    name: '营销专员',
    description: '营销专员角色',
    permissions: [
      'dashboard.view',
      'package.view',
      'customer.view',
      'analytics.customer',
    ],
    userCount: 3,
    status: 'active',
    isSystem: false,
    createdAt: '2023-03-01 16:20:00',
  },
];

const RoleSettings: React.FC = () => {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleItem | null>(null);
  const [permissionTree] = useState<PermissionTree[]>(getPermissionTree());
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setRoles([...mockRoles]);
      setLoading(false);
    }, 800);
  };

  const handleAddRole = () => {
    setCurrentRole(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'active',
      permissions: [],
    });
    setModalVisible(true);
  };

  const handleEditRole = (record: RoleItem) => {
    setCurrentRole(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      status: record.status,
      permissions: record.permissions,
    });
    setModalVisible(true);
  };

  const handleDeleteRole = async (id: number) => {
    try {
      // 模拟API请求
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRoles(roles.filter(role => role.id !== id));
      message.success('角色删除成功');
    } catch (error) {
      message.error('角色删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, newStatus: 'active' | 'disabled') => {
    try {
      // 模拟API请求
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedRoles = roles.map(role => 
        role.id === id ? { ...role, status: newStatus } : role
      );
      setRoles(updatedRoles);
      message.success(`角色${newStatus === 'active' ? '启用' : '禁用'}成功`);
    } catch (error) {
      message.error(`角色${newStatus === 'active' ? '启用' : '禁用'}失败`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (currentRole) {
        // 更新角色
        const updatedRoles = roles.map(role => 
          role.id === currentRole.id 
            ? { 
                ...role, 
                name: values.name,
                description: values.description,
                status: values.status,
                permissions: values.permissions,
              } 
            : role
        );
        setRoles(updatedRoles);
        message.success('角色更新成功');
      } else {
        // 创建角色
        const newRole: RoleItem = {
          id: Math.max(...roles.map(role => role.id)) + 1,
          name: values.name,
          description: values.description,
          permissions: values.permissions,
          status: values.status,
          userCount: 0,
          isSystem: false,
          createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
        };
        setRoles([...roles, newRole]);
        message.success('角色创建成功');
      }
      
      setModalVisible(false);
    } catch (error) {
      // Form validation error
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: RoleItem) => (
        <Space>
          {text}
          {record.isSystem && <Tag color="blue">系统</Tag>}
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status === 'active' ? '启用' : '禁用'} 
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RoleItem) => (
        <Space size="middle">
          {record.status === 'active' ? (
            <Button 
              type="link" 
              size="small" 
              icon={<LockOutlined />}
              onClick={() => handleToggleStatus(record.id, 'disabled')}
              disabled={record.isSystem && record.name === '超级管理员'}
            >
              禁用
            </Button>
          ) : (
            <Button 
              type="link" 
              size="small" 
              icon={<UnlockOutlined />}
              onClick={() => handleToggleStatus(record.id, 'active')}
            >
              启用
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
            disabled={record.isSystem && record.name === '超级管理员'}
          >
            编辑
          </Button>
          {!record.isSystem && (
            <Popconfirm
              title="确定要删除这个角色吗？"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDeleteRole(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="role-settings-page">
      <Card
        title="角色管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRole}
          >
            新建角色
          </Button>
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={roles}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        </Spin>
      </Card>

      <Modal
        title={currentRole ? '编辑角色' : '新建角色'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSaveRole}
        width={720}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" disabled={currentRole?.isSystem} />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="角色描述"
          >
            <Input.TextArea placeholder="请输入角色描述" rows={2} />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            getValueFromEvent={(checked: boolean) => checked ? 'active' : 'disabled'}
            getValueProps={(value: RoleStatus) => ({ checked: value === 'active' })}
          >
            <Switch 
              checkedChildren="启用" 
              unCheckedChildren="禁用" 
              disabled={currentRole?.isSystem && currentRole?.name === '超级管理员'} 
            />
          </Form.Item>
          
          <Form.Item
            name="permissions"
            label="权限配置"
            rules={[{ required: true, message: '请选择至少一项权限' }]}
          >
            <Tree
              checkable
              treeData={permissionTree}
              disabled={currentRole?.isSystem && currentRole?.name === '超级管理员'}
              defaultExpandAll
              checkStrictly={false}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleSettings;
