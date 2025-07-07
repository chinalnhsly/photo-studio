import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Divider,
  Tag,
  Switch,
  Row,
  Col,
  Tooltip
} from 'antd';
import Tree from 'antd/lib/tree';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  LockOutlined,
  UserOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getRoles, createRole, updateRole, deleteRole, getRolePermissionList } from '../../services/system';
import './RoleManagement.scss';

interface RoleItem {
  id: number;
  name: string;
  description: string;
  userCount: number;
  isDefault: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PermissionItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  parentId?: number;
  children?: PermissionItem[];
}

const RoleManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleItem | null>(null);
  const [permissionTree, setPermissionTree] = useState<PermissionItem[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error('获取角色列表失败:', error);
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = async (roleId: number) => {
    setLoading(true);
    try {
      const response = await getRolePermissionList(roleId);
      setPermissionTree(response.data.permissions || []);
      setSelectedPermissions(response.data.assignedPermissions || []);
    } catch (error) {
      console.error('获取角色权限失败:', error);
      message.error('获取角色权限失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    setCurrentRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditRole = (role: RoleItem) => {
    setCurrentRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      isDefault: role.isDefault
    });
    setModalVisible(true);
  };

  const handleEditPermissions = async (role: RoleItem) => {
    setCurrentRole(role);
    await fetchRolePermissions(role.id);
    setPermissionModalVisible(true);
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await deleteRole(id);
      message.success('角色删除成功');
      fetchRoles();
    } catch (error) {
      console.error('删除角色失败:', error);
      message.error('删除角色失败，可能该角色已关联用户或是系统预设角色');
    }
  };

  const handleSubmitRole = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      if (currentRole) {
        // 更新角色
        await updateRole(currentRole.id, values);
        message.success('角色更新成功');
      } else {
        // 创建新角色
        await createRole(values);
        message.success('角色创建成功');
      }
      
      setModalVisible(false);
      fetchRoles();
    } catch (error) {
      console.error('提交角色数据失败:', error);
      message.error('保存角色失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitPermissions = async () => {
    if (!currentRole) return;
    
    try {
      setSubmitting(true);
      await updateRole(currentRole.id, {
        permissions: selectedPermissions
      });
      message.success('权限设置已保存');
      setPermissionModalVisible(false);
    } catch (error) {
      console.error('更新角色权限失败:', error);
      message.error('权限保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 表格列定义
  const columns: ProColumns<RoleItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="role-name">
          <span className="role-title">{record.name}</span>
          {record.isSystem && <Tag color="blue">系统</Tag>}
          {record.isDefault && <Tag color="green">默认</Tag>}
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      search: false,
      render: (userCount) => (
        <div className="user-count">
          <TeamOutlined /> {userCount}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEditRole(record)}
          disabled={record.isSystem}
        >
          编辑
        </Button>,
        <Button
          key="permissions"
          type="link"
          icon={<LockOutlined />}
          onClick={() => handleEditPermissions(record)}
          disabled={record.isSystem && record.name === 'SuperAdmin'}
        >
          设置权限
        </Button>,
        <Popconfirm
          key="delete"
          title="确定要删除此角色吗?"
          description="删除后将无法恢复，已分配的用户将失去此角色权限"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleDeleteRole(record.id)}
          disabled={record.isSystem || record.isDefault}
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            disabled={record.isSystem || record.isDefault}
          >
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title="角色权限管理">
      <div className="role-management-page">
        <Card>
          <ProTable<RoleItem>
            headerTitle="角色列表"
            actionRef={actionRef}
            rowKey="id"
            search={false}
            loading={loading}
            dataSource={roles}
            columns={columns}
            pagination={{
              pageSize: 10,
            }}
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleAddRole}
              >
                新增角色
              </Button>,
            ]}
          />
        </Card>
        
        {/* 角色编辑对话框 */}
        <Modal
          title={currentRole ? '编辑角色' : '新增角色'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSubmitRole}
          confirmLoading={submitting}
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
              <Input placeholder="请输入角色名称" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="角色描述"
            >
              <Input.TextArea rows={3} placeholder="请输入角色描述" />
            </Form.Item>
            
            <Form.Item
              name="isDefault"
              label="默认角色"
              valuePropName="checked"
              tooltip="新用户注册时将默认分配此角色"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
        
        {/* 权限设置对话框 */}
        <Modal
          title={`设置权限: ${currentRole?.name}`}
          open={permissionModalVisible}
          onCancel={() => setPermissionModalVisible(false)}
          onOk={handleSubmitPermissions}
          confirmLoading={submitting}
          width={720}
        >
          <div className="permission-tree-container">
            {loading ? (
              <div className="tree-loading">加载权限数据中...</div>
            ) : (
              <>
                <div className="permission-hint">
                  <QuestionCircleOutlined /> 勾选需要授予该角色的权限，权限更改将立即影响所有拥有此角色的用户。
                </div>
                <Row>
                  <Col span={24}>
                    <Tree
                      checkable
                      checkStrictly
                      defaultExpandAll
                      checkedKeys={selectedPermissions}
                      onCheck={(checked) => setSelectedPermissions(
                        Array.isArray(checked) ? checked as string[] : checked.checked as string[]
                      )}
                      treeData={permissionTree.map(group => ({
                        title: group.name,
                        key: group.code,
                        children: group.children?.map(perm => ({
                          title: (
                            <Tooltip title={perm.description}>
                              <span>{perm.name}</span>
                            </Tooltip>
                          ),
                          key: perm.code,
                        }))
                      }))}
                    />
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default RoleManagement;
