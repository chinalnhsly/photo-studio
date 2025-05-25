import request from '@/utils/request';



// 获取摄影师下拉选项,获取摄影师选项列表
export async function getPhotographerOptions() {
  return request('/api/photographers/options', {
    method: 'GET',
  });
}

// 获取工作室下拉选项,获取工作室选项列表
export async function getStudioOptions() {
  return request('/api/studios/options', {
    method: 'GET',
  });
}

// 获取客户下拉选项
export async function getCustomerOptions(params?: { keyword?: string }) {
  return request('/api/customers/options', {
    method: 'GET',
    params,
  });
}

// 获取套餐下拉选项
export async function getPackageOptions() {
  return request('/api/packages/options', {
    method: 'GET',
  });
}

// 获取员工下拉选项
export async function getEmployeeOptions() {
  return request('/api/employees/options', {
    method: 'GET',
  });
}

// 获取拍摄类型选项
export async function getShootingTypeOptions() {
  return request('/api/common/shooting-types', {
    method: 'GET',
  });
}

// 获取字典数据
export async function getDictionary(type: string) {
  return request(`/api/common/dictionary/${type}`, {
    method: 'GET',
  });
}

// 上传文件
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return request('/api/upload', {
    method: 'POST',
    data: formData,
  });
}

// 获取系统配置
export async function getSystemConfig(key?: string) {
  return request('/api/common/config', {
    method: 'GET',
    params: { key },
  });
}

// 获取当前用户信息
export async function getCurrentUser() {
  return request('/api/user/current', {
    method: 'GET',
  });
}

// 获取地区数据
export async function getRegions(params?: { parentId?: number }) {
  return request('/api/common/regions', {
    method: 'GET',
    params,
  });
}
