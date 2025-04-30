import request from '@/utils/request';

/**
 * 获取摄影师排班
 * @param photographerId 摄影师ID
 * @param params 查询参数
 */
export async function getPhotographerSchedule(photographerId: number, params?: any) {
  return request(`/api/schedule/photographer/${photographerId}`, {
    method: 'GET',
    params,
  });
}

/**
 * 创建时间槽
 * @param data 时间槽数据
 */
export async function createTimeSlots(data: any) {
  return request('/api/schedule/timeslots', {
    method: 'POST',
    data,
  });
}
// 批量创建时间段
export const batchCreateTimeSlots = async (data: any) => {
  const response = await request('/api/schedule/batch', {
    method: 'POST',
    data,
  });
  return response;
};

// 删除时间段
export const deleteTimeSlot = async (id: number) => {
  const response = await request(`/api/schedule/${id}`, {
    method: 'DELETE',
  });
  return response;
};

// 更新时间段
export const updateTimeSlot = async (id: number, data: any) => {
  const response = await request(`/api/schedule/${id}`, {
    method: 'PUT',
    data,
  });
  return response;
};

// 获取时间段列表
export const getTimeSlots = async (params: any) => {
  const response = await request('/api/schedule/timeslots', {
    method: 'GET',
    params,
  });
  return response;
}