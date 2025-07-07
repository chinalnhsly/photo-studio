import  request from 'umi-request';

// 角色管理相关 API

// 获取角色列表
export async function getRoles() {
  return request('/api/system/roles', {
    method: 'GET',
  });
}

// 获取单个角色
export async function getRoleById(id: number) {
  return request(`/api/system/roles/${id}`, {
    method: 'GET',
  });
}

// 创建角色
export async function createRole(data: {
  name: string;
  description?: string;
  permissions: string[];
  isSystemRole?: boolean;
}) {
  return request('/api/system/roles', {
    method: 'POST',
    data,
  });
}

// 更新角色
export async function updateRole(id: number, data: {
  name?: string;
  description?: string;
  permissions?: string[];
  isSystemRole?: boolean;
}) {
  return request(`/api/system/roles/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除角色
export async function deleteRole(id: number) {
  return request(`/api/system/roles/${id}`, {
    method: 'DELETE',
  });
}

// 获取角色下的用户列表
export async function getUsersByRole(roleId: number) {
  return request(`/api/system/roles/${roleId}/users`, {
    method: 'GET',
  });
}

// 分配用户到角色
export async function assignRoleToUsers(roleId: number, userIds: number[]) {
  return request(`/api/system/roles/${roleId}/assign`, {
    method: 'POST',
    data: { userIds },
  });
}

// 从角色中移除用户
export async function removeRoleFromUsers(roleId: number, userIds: number[]) {
  return request(`/api/system/roles/${roleId}/remove`, {
    method: 'POST',
    data: { userIds },
  });
}

// 权限相关 API

// 获取权限树
export async function getPermissionTree() {
  return request('/api/system/permissions/tree', {
    method: 'GET',
  });
}

// 获取所有权限列表
export async function getAllPermissions() {
  return request('/api/system/permissions', {
    method: 'GET',
  });
}

// 获取角色权限列表
export async function getRolePermissionList(roleId: number) {
  return request(`/api/system/roles/${roleId}/permissions`, {
    method: 'GET',
  });
}

// 更新角色权限
export async function updateRolePermissions(roleId: number, permissionIds: string[]) {
  return request(`/api/system/roles/${roleId}/permissions`, {
    method: 'PUT',
    data: { permissionIds },
  });
}

// 用户管理相关 API

// 获取用户列表
export async function getUsers(params?: any) {
  return request('/api/system/users', {
    method: 'GET',
    params,
  });
}

// 获取单个用户
export async function getUserById(id: number) {
  return request(`/api/system/users/${id}`, {
    method: 'GET',
  });
}

// 创建用户
export async function createUser(data: any) {
  return request('/api/system/users', {
    method: 'POST',
    data,
  });
}

// 更新用户
export async function updateUser(id: number, data: any) {
  return request(`/api/system/users/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除用户
export async function deleteUser(id: number) {
  return request(`/api/system/users/${id}`, {
    method: 'DELETE',
  });
}

// 重置用户密码
export async function resetUserPassword(id: number) {
  return request(`/api/system/users/${id}/reset-password`, {
    method: 'POST',
  });
}

// 启用或禁用用户
export async function toggleUserStatus(id: number, isActive: boolean) {
  return request(`/api/system/users/${id}/status`, {
    method: 'PUT',
    data: { isActive },
  });
}

// 获取用户的角色
export async function getUserRoles(id: number) {
  return request(`/api/system/users/${id}/roles`, {
    method: 'GET',
  });
}

// 部门管理相关 API

// 获取部门树
export async function getDepartmentTree() {
  return request('/api/system/departments/tree', {
    method: 'GET',
  });
}

// 创建部门
export async function createDepartment(data: {
  name: string;
  parentId?: number;
  description?: string;
}) {
  return request('/api/system/departments', {
    method: 'POST',
    data,
  });
}

// 更新部门
export async function updateDepartment(id: number, data: {
  name?: string;
  parentId?: number;
  description?: string;
}) {
  return request(`/api/system/departments/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除部门
export async function deleteDepartment(id: number) {
  return request(`/api/system/departments/${id}`, {
    method: 'DELETE',
  });
}

// 获取部门用户
export async function getDepartmentUsers(id: number) {
  return request(`/api/system/departments/${id}/users`, {
    method: 'GET',
  });
}

// 系统日志相关 API

// 获取操作日志
export async function getOperationLogs(params?: any) {
  return request('/api/system/logs/operations', {
    method: 'GET',
    params,
  });
}

// 获取登录日志
export async function getLoginLogs(params?: any) {
  return request('/api/system/logs/logins', {
    method: 'GET',
    params,
  });
}

// 系统设置相关 API

// 获取系统设置
export async function getSystemSettings() {
  return request('/api/system/settings', {
    method: 'GET',
  });
}

// 更新系统设置
export async function updateSystemSettings(data: any) {
  return request('/api/system/settings', {
    method: 'PUT',
    data,
  });
}
