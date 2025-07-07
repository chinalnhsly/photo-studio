import request  from 'umi-request';
import type { RcFile } from 'antd/lib/upload/interface';

// 获取所有工作室
export async function getStudioList(params?: any) {
  return request('/api/studios', {
    method: 'GET',
    params,
  });
}

// 获取工作室详情
export async function getStudioById(id: number) {
  return request(`/api/studios/${id}`, {
    method: 'GET',
  });
}

// 创建工作室
export async function createStudio(data: any) {
  return request('/api/studios', {
    method: 'POST',
    data,
  });
}

// 更新工作室
export async function updateStudio(id: number, data: any) {
  return request(`/api/studios/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除工作室
export async function deleteStudio(id: number) {
  return request(`/api/studios/${id}`, {
    method: 'DELETE',
  });
}

// 获取工作室设施
export async function getStudioFacilities(studioId: number) {
  return request('/api/facilities', {
    method: 'GET',
    params: { studioId },
  });
}

// 更新工作室设施
export async function updateStudioFacilities(studioId: number, facilityIds: number[]) {
  return request(`/api/studios/${studioId}/facilities`, {
    method: 'PUT',
    data: { facilityIds },
  });
}

// 获取工作室营业时间
export async function getStudioBusinessHours(studioId: number) {
  return request(`/api/studios/${studioId}/business-hours`, {
    method: 'GET',
  });
}

// 更新工作室营业时间
export async function updateStudioBusinessHours(studioId: number, hours: BusinessHours) {
  return request(`/api/studios/${studioId}/business-hours`, {
    method: 'PUT',
    data: { hours },
  });
}

// 上传工作室图片
export async function uploadStudioImages(file: RcFile) {
  const formData = new FormData();
  formData.append('file', file);

  return request('/api/studios/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

// 营业时间类型定义
export interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };
}
