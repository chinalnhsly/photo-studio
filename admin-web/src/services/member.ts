import  request  from 'umi-request';
import { PointLogType } from '../types/member';

// 获取会员列表
export async function getMembers(params?: any) {
  return request('/api/members', {
    method: 'GET',
    params,
  });
}

// 获取单个会员详情
export async function getMemberById(id: number) {
  return request(`/api/members/${id}`, {
    method: 'GET',
  });
}

// 创建会员
export async function createMember(data: any) {
  return request('/api/members', {
    method: 'POST',
    data,
  });
}

// 更新会员
export async function updateMember(id: number, data: any) {
  return request(`/api/members/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除会员
export async function deleteMember(id: number) {
  return request(`/api/members/${id}`, {
    method: 'DELETE',
  });
}

// 更新会员状态
export async function updateMemberStatus(id: number, isActive: boolean) {
  return request(`/api/members/${id}/status`, {
    method: 'PUT',
    data: { isActive },
  });
}

// 获取会员等级列表
export async function getMemberLevels() {
  return request('/api/member-levels', {
    method: 'GET',
  });
}

// 创建会员等级
export async function createMemberLevel(data: any) {
  return request('/api/member-levels', {
    method: 'POST',
    data,
  });
}

// 更新会员等级
export async function updateMemberLevel(id: number, data: any) {
  return request(`/api/member-levels/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除会员等级
export async function deleteMemberLevel(id: number) {
  return request(`/api/member-levels/${id}`, {
    method: 'DELETE',
  });
}

// 调整会员积分
export async function addMemberPoints(id: number, data: { 
  points: number; 
  type: PointLogType; 
  description?: string; 
}) {
  return request(`/api/members/${id}/points`, {
    method: 'POST',
    data,
  });
}

// 获取会员积分记录
export async function getMemberLogs(id: number, params?: any) {
  return request(`/api/members/${id}/points/logs`, {
    method: 'GET',
    params,
  });
}

// 获取会员消费记录
export async function getMemberOrders(id: number, params?: any) {
  return request(`/api/members/${id}/orders`, {
    method: 'GET',
    params,
  });
}

// 获取会员预约记录
export async function getMemberBookings(id: number, params?: any) {
  return request(`/api/members/${id}/bookings`, {
    method: 'GET',
    params,
  });
}

// 修改会员等级
export async function changeMemberLevel(id: number, levelId: number) {
  return request(`/api/members/${id}/level`, {
    method: 'PUT',
    data: { levelId },
  });
}

// 发送营销短信
export async function sendMarketingSMS(id: number, data: { 
  templateId: string; 
  params?: Record<string, string>; 
}) {
  return request(`/api/members/${id}/sms`, {
    method: 'POST',
    data,
  });
}

// 获取会员标签列表
export async function getMemberTags() {
  return request('/api/member-tags', {
    method: 'GET',
  });
}

// 为会员添加标签
export async function addMemberTags(id: number, tagIds: number[]) {
  return request(`/api/members/${id}/tags`, {
    method: 'POST',
    data: { tagIds },
  });
}

// 移除会员标签
export async function removeMemberTag(id: number, tagId: number) {
  return request(`/api/members/${id}/tags/${tagId}`, {
    method: 'DELETE',
  });
}

// 导出会员数据
export async function exportMembers(params?: any) {
  return request('/api/members/export', {
    method: 'GET',
    params,
    responseType: 'blob',
  }).then(blob => {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `会员数据-${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

// 批量导入会员
export async function importMembers(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return request('/api/members/import', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

// 获取会员统计数据
export async function getMemberStats() {
  return request('/api/members/stats', {
    method: 'GET',
  });
}
