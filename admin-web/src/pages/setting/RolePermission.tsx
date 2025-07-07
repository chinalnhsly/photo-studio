import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Checkbox,
  message,
  Divider,
  Typography,
  Tabs,
  Popconfirm,
  Tag,
  Row,
  Col,
  Badge,
  Descriptions,
  Avatar,
  List,
  Switch,
  Tooltip,
} from 'antd';
import Tree from 'antd/es/tree';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  KeyOutlined,
  InfoCircleOutlined,
  ApartmentOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { 
  getRoles, 
  createRole, 
  updateRole, 
  deleteRole, 
  getPermissionTree,
  getUsersByRole,
  assignRoleToUsers,
  removeRoleFromUsers
} from '../../services/system';
import './RolePermission.scss';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { DirectoryTree } = Tree;

// 定义类型接口
interface Role {
  id: number;
  name: string;
  description?: string;
  isSystemRole?: boolean;
  permissions?: string[];
  userCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  assignedAt?: string;
}

interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
}

interface RoleFormValues {
  name: string;
  description?: string;
  permissions: string[];
  isSystemRole?: boolean;
}

const RolePermission: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionTree, setPermissionTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [activeTab, setActiveTab] = useState<string>('roles');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleUsers, setRoleUsers] = useState<User[]>([]);
  const [roleUsersLoading, setRoleUsersLoading] = useState<boolean>(false);
  const [assignUserModalVisible, setAssignUserModalVisible] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 角色和权限数据获取
  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取角色列表
      const rolesResponse = await getRoles();
      setRoles(rolesResponse.data);

      // 获取权限树
      const permissionResponse = await getPermissionTree();
      setPermissionTree(permissionResponse.data);
      
      // 设置默认展开所有父节点
      const expandedKeysFromTree = getParentKeys(permissionResponse.data);
      setExpandedKeys(expandedKeysFromTree);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 提取父节点keys
  const getParentKeys = (treeData: any[]): React.Key[] => {
    let keys: React.Key[] = [];
    const traverse = (data: any[]) => {
      data.forEach(item => {
        if (item.children && item.children.length) {
          keys.push(item.key);
          traverse(item.children);
        }
      });
    };
    traverse(treeData);
    return keys;
  };

  // 打开创建角色对话框
  const handleCreateRole = () => {
    setEditingRole(null);
    form.resetFields();
    setCheckedKeys([]);
    setModalVisible(true);
  };

  // 打开编辑角色对话框
  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      isSystemRole: role.isSystemRole || false,
    });
    setCheckedKeys(role.permissions || []);
    setModalVisible(true);
  };

  // 处理删除角色
  const handleDeleteRole = async (id: number) => {
    try {
      await deleteRole(id);
      message.success('角色删除成功');
      fetchData();
    } catch (error) {
      console.error('删除角色失败:', error);
      message.error('删除角色失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData: RoleFormValues = {
        ...values,
        permissions: checkedKeys as string[],
      };

      if (editingRole) {
        await updateRole(editingRole.id, formData);
        message.success('角色更新成功');
      } else {
        await createRole(formData);
        message.success('角色创建成功');
      }

      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('提交失败，请检查表单');
    }
  };

  // 处理权限树选择变化
  const handleTreeCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    setCheckedKeys(Array.isArray(checked) ? checked : checked.checked);
  };

  // 处理角色选择，显示角色详情
  const handleRoleSelect = async (role: Role) => {
    setSelectedRole(role);
    await fetchRoleUsers(role.id);
    setActiveTab('details');
  };

  // 获取角色下的用户
  const fetchRoleUsers = async (roleId: number) => {
    setRoleUsersLoading(true);
    try {
      const response = await getUsersByRole(roleId);
      setRoleUsers(response.data || []);
    } catch (error) {
      console.error('获取角色用户失败:', error);
      message.error('获取角色用户列表失败');
    } finally {
      setRoleUsersLoading(false);
    }
  };

  // 打开分配用户对话框
  const handleOpenAssignUserModal = () => {
    setSelectedUsers([]);
    setAssignUserModalVisible(true);

    // 这里应该有获取所有用户的API调用
    // 为了示例简化，我们使用模拟数据
    setAllUsers([
      { id: 1, name: '张三', email: 'zhangsan@example.com', avatar: '' },
      { id: 2, name: '李四', email: 'lisi@example.com', avatar: '' },
      { id: 3, name: '王五', email: 'wangwu@example.com', avatar: '' },
      { id: 4, name: '赵六', email: 'zhaoliu@example.com', avatar: '' },
    ]);
  };

  // 处理分配用户
  const handleAssignUsers = async () => {
    if (!selectedRole || selectedUsers.length === 0) return;

    try {
      await assignRoleToUsers(selectedRole.id, selectedUsers);
      message.success('用户分配成功');
      setAssignUserModalVisible(false);
      // 重新加载角色用户
      await fetchRoleUsers(selectedRole.id);
    } catch (error) {
      console.error('分配用户失败:', error);
      message.error('分配用户失败');
    }
  };

  // 移除用户角色
  const handleRemoveRoleFromUser = async (userId: number) => {
    if (!selectedRole) return;

    try {
      await removeRoleFromUsers(selectedRole.id, [userId]);
      message.success('角色移除成功');
      // 重新加载角色用户
      await fetchRoleUsers(selectedRole.id);
    } catch (error) {
      console.error('移除角色失败:', error);
      message.error('移除角色失败');
    }
  };

  // 角色表格列定义
  const roleColumns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Role) => (
        <Space>
          <a onClick={() => handleRoleSelect(record)}>{text}</a>
          {record.isSystemRole && <Tag color="blue">系统角色</Tag>}
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="middle">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
            disabled={record.isSystemRole && record.name === 'admin'}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此角色吗?"
            description="删除后将无法恢复，已分配该角色的用户将失去相关权限。"
            onConfirm={() => handleDeleteRole(record.id)}
            okText="确定"
            cancelText="取消"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            disabled={record.isSystemRole}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record.isSystemRole}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 角色用户表格列
  const roleUserColumns = [
    {
      title: '用户',
      key: 'name',
      render: (_: any, record: User) => (
        <div className="user-cell">
          <Avatar src={record.avatar} icon={<UserOutlined />} size="small" />
          <span className="user-name">{record.name}</span>
        </div>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '分配时间',
      dataIndex: 'assignedAt',
      key: 'assignedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Popconfirm
          title="确定要移除此用户的角色吗?"
          onConfirm={() => handleRemoveRoleFromUser(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="text" danger size="small">
            移除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // 渲染权限树说明
  const renderPermissionLegend = () => (
    <div className="permission-legend">
      <Title level={5}>权限等级说明:</Title>
      <ul>
        <li>
          <Badge status="success" /> <b>查看权限</b> - 允许浏览内容，但不能修改
        </li>
        <li>
          <Badge status="warning" /> <b>编辑权限</b> - 允许修改内容，但不能删除或创建
        </li>
        <li>
          <Badge status="error" /> <b>完全权限</b> - 允许查看、编辑、创建和删除
        </li>
      </ul>
      <Paragraph type="secondary">
        请谨慎分配权限，系统角色的权限更改可能影响系统正常运行。
      </Paragraph>
    </div>
  );

  return (
    <div className="role-permission-page">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={
            <span>
              <TeamOutlined />
              角色列表
            </span>
          } 
          key="roles"
        >
          <Card
            title="角色管理"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateRole}
              >
                新建角色
              </Button>
            }
          >
            <Table
              loading={loading}
              dataSource={roles}
              columns={roleColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        {selectedRole && (
          <TabPane
            tab={
              <span>
                <SafetyCertificateOutlined />
                角色详情
              </span>
            }
            key="details"
          >
            <Card title={`角色详情: ${selectedRole.name}`}>
              <Tabs defaultActiveKey="info">
                <TabPane
                  tab={
                    <span>
                      <InfoCircleOutlined />
                      基本信息
                    </span>
                  }
                  key="info"
                >
                  <Descriptions bordered>
                    <Descriptions.Item label="角色名称" span={3}>
                      {selectedRole.name}
                      {selectedRole.isSystemRole && (
                        <Tag color="blue" style={{ marginLeft: 8 }}>
                          系统角色
                        </Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="描述" span={3}>
                      {selectedRole.description || '无描述'}
                    </Descriptions.Item>
                    <Descriptions.Item label="创建时间">
                      {selectedRole.createdAt}
                    </Descriptions.Item>
                    <Descriptions.Item label="更新时间">
                      {selectedRole.updatedAt}
                    </Descriptions.Item>
                    <Descriptions.Item label="用户数量">
                      {selectedRole.userCount || 0}
                    </Descriptions.Item>
                  </Descriptions>

                  <div style={{ marginTop: 24 }}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEditRole(selectedRole)}
                      disabled={selectedRole.isSystemRole && selectedRole.name === 'admin'}
                    >
                      编辑角色
                    </Button>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <KeyOutlined />
                      权限设置
                    </span>
                  }
                  key="permissions"
                >
                  <Row gutter={24}>
                    <Col xs={24} lg={16}>
                      <Card title="已分配权限" className="inner-card">
                        <DirectoryTree
                          checkable
                          disabled
                          treeData={permissionTree}
                          checkedKeys={selectedRole.permissions || []}
                          expandedKeys={expandedKeys}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      {renderPermissionLegend()}
                      <Divider />
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEditRole(selectedRole)}
                        disabled={selectedRole.isSystemRole && selectedRole.name === 'admin'}
                      >
                        修改权限设置
                      </Button>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <UsergroupAddOutlined />
                      用户管理 ({roleUsers.length})
                    </span>
                  }
                  key="users"
                >
                  <div className="user-management">
                    <div className="user-management-header">
                      <Title level={5}>已分配用户列表</Title>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleOpenAssignUserModal}
                      >
                        添加用户
                      </Button>
                    </div>

                    <Table
                      loading={roleUsersLoading}
                      dataSource={roleUsers}
                      columns={roleUserColumns}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      locale={{ emptyText: '暂无已分配用户' }}
                    />
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </TabPane>
        )}
      </Tabs>

      {/* 创建/编辑角色对话框 */}
      <Modal
        title={editingRole ? '编辑角色' : '创建角色'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={800}
        okButtonProps={{ disabled: loading }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input 
              placeholder="请输入角色名称" 
              disabled={editingRole?.isSystemRole && editingRole?.name === 'admin'}
            />
          </Form.Item>

          <Form.Item name="description" label="角色描述">
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>

          {editingRole?.isSystemRole && (
            <Form.Item name="isSystemRole" valuePropName="checked">
              <Checkbox disabled>系统角色</Checkbox>
            </Form.Item>
          )}

          <Divider>权限设置</Divider>

          <div className="permission-tree-container">
            <DirectoryTree
              checkable
              onCheck={(checked) => handleTreeCheck(checked)}
              checkedKeys={checkedKeys}
              expandedKeys={expandedKeys}
              onExpand={(keys: React.Key[]) => setExpandedKeys(keys)}
              treeData={permissionTree}
              disabled={editingRole?.isSystemRole && editingRole?.name === 'admin'}
            />
          </div>

          {renderPermissionLegend()}
        </Form>
      </Modal>

      {/* 分配用户对话框 */}
      <Modal
        title="分配用户到角色"
        open={assignUserModalVisible}
        onCancel={() => setAssignUserModalVisible(false)}
        onOk={handleAssignUsers}
        width={600}
        okButtonProps={{ disabled: selectedUsers.length === 0 }}
        okText="确认分配"
      >
        <Paragraph>
          选择需要分配到 <Tag color="blue">{selectedRole?.name}</Tag> 角色的用户:
        </Paragraph>
        
        <List
          dataSource={allUsers}
          renderItem={(user: User) => (
            <List.Item
              key={user.id}
              actions={[
                <Checkbox
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user.id]);
                    } else {
                      setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                    }
                  }}
                  checked={selectedUsers.includes(user.id)}
                />
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} src={user.avatar} />}
                title={user.name}
                description={user.email}
              />
            </List.Item>
          )}
          bordered
          pagination={{
            pageSize: 5,
          }}
        />
      </Modal>
    </div>
  );
};

export default RolePermission;
