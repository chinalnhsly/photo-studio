import request from '../utils/request';

// 获取客户列表
export async function getCustomerList(params: any) {
  return request.get('/api/customers', { params }) as Promise<{
    data: {
      items: any[];
      total: number;
    };
    success: boolean;
  }>;
}

// 获取客户详情
export async function getCustomerDetail(id: number) {
  return request.get(`/api/customers/${id}`) as Promise<{
    data: any;
    success: boolean;
  }>;
}

// 创建客户
export async function createCustomer(data: any) {
  return request.post('/api/customers', data) as unknown as Promise<{
    data: any;
    success: boolean;
  }>;
}

// 更新客户
export async function updateCustomer(id: number, data: any) {
  return request.put(`/api/customers/${id}`, data) as unknown as Promise<{
    data: any;
    success: boolean;
  }>;
}

// 删除客户
export async function deleteCustomer(id: number) {
  return request.delete(`/api/customers/${id}`) as Promise<{
    success: boolean;
  }>;
}

// 设置客户标签
export async function setCustomerTags(id: number, tags: string[]) {
  return request.post(`/api/customers/${id}/tags`, { tags }) as Promise<{
    success: boolean;
  }>;
}

/**
 * 添加客户标签
 * @param id 客户ID
 * @param tags 要添加的标签数组
 */
export async function addCustomerTags(id: number, tags: string[]) {
  return request.post(`/api/customers/${id}/tags/add`, { tags }) as unknown as Promise<{
    success: boolean;
    data: {
      tags: string[];
    };
  }>;
}

/**
 * 移除客户标签
 * @param id 客户ID
 * @param tags 要移除的标签数组
 */
export async function removeCustomerTags(id: number, tags: string[]) {
  return request.post(`/api/customers/${id}/tags/remove`, { tags }) as unknown as Promise<{
    success: boolean;
    data: {
      tags: string[];
    };
  }>;
}

/**
 * 搜索客户
 * @param params 搜索参数
 */
export async function searchCustomers(params: {
  keyword?: string;
  fields?: string[];
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}) {
  return request.get('/api/customers/search', { params }) as unknown as Promise<{
    data: {
      items: any[];
      total: number;
    };
    success: boolean;
  }>;
}

/**
 * 导出客户数据
 * @param params 导出参数
 */
export async function exportCustomers(params?: {
  ids?: number[];
  fields?: string[];
  format?: 'csv' | 'xlsx' | 'pdf';
  dateRange?: [string, string];
  filters?: Record<string, any>;
}) {
  return request.post('/api/customers/export', { ...params, responseType: 'blob' }) as unknown as Promise<Blob>;
}

/**
 * 获取常用客户标签列表
 * @param params 查询参数 (可选)
 * @returns 标签列表数据
 */
export async function getCommonTags(params?: { 
  limit?: number; 
  category?: string; 
}): Promise<{
  data: Array<{
    id: string | number;
    name: string;
    color?: string;
    category?: string;
    count?: number; // 使用该标签的客户数量
  }>;
  success: boolean;
}> {
  return request.get('/api/customers/common-tags', { params }) as unknown as Promise<{
    data: Array<{
      id: string | number;
      name: string;
      color?: string;
      category?: string;
      count?: number;
    }>;
    success: boolean;
  }>;
}

// 获取客户预约历史
export async function getCustomerBookingHistory(id: number, params?: any) {
  return request.get(`/api/customers/${id}/bookings`, { params }) as Promise<{
    data: any[];
    total: number;
    success: boolean;
  }>;
}

// 获取客户消费记录
export async function getCustomerOrders(id: number, params?: any) {
  return request.get(`/api/customers/${id}/orders`, { params }) as Promise<{
    data: any[];
    total: number;
    success: boolean;
  }>;
}

// 批量导入客户
export async function batchImportCustomers(data: any[]) {
  return request.post('/api/customers/batch-import', { customers: data }) as Promise<{
    success: boolean;
    data: {
      imported: number;
      failed: number;
      errors: any[];
    };
  }>;
}
