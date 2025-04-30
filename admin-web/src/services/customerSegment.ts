import request from '../utils/request';

// 获取客户细分列表
export async function getCustomerSegments() {
  return request('/api/customer-segments', {
    method: 'GET',
  });
}

// 获取客户细分详情
export async function getCustomerSegmentById(id: number) {
  return request(`/api/customer-segments/${id}`, {
    method: 'GET',
  });
}

// 创建客户细分
export async function createCustomerSegment(data: any) {
  return request('/api/customer-segments', {
    method: 'POST',
    data,
  });
}

// 更新客户细分
export async function updateCustomerSegment(id: number, data: any) {
  return request(`/api/customer-segments/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除客户细分
export async function deleteCustomerSegment(id: number) {
  return request(`/api/customer-segments/${id}`, {
    method: 'DELETE',
  });
}

// 获取客户细分中的客户列表
export async function getCustomersInSegment(id: number, params?: any) {
  return request(`/api/customer-segments/${id}/customers`, {
    method: 'GET',
    params,
  });
}

// 运行客户细分规则
export async function runSegmentRule(data: any) {
  return request('/api/customer-segments/run-rule', {
    method: 'POST',
    data,
  });
}

// 创建客户细分标签
export async function createSegmentTag(id: number, tagName: string) {
  return request(`/api/customer-segments/${id}/tags`, {
    method: 'POST',
    data: { name: tagName },
  });
}

// 获取客户细分数据统计
export async function getSegmentStatistics(id: number) {
  return request(`/api/customer-segments/${id}/statistics`, {
    method: 'GET',
  });
}

// 批量导出细分客户
export async function exportSegmentCustomers(id: number) {
  return request(`/api/customer-segments/${id}/export`, {
    method: 'GET',
    responseType: 'blob',
  }).then(blob => {
    const fileName = `客户细分_${id}_${new Date().toISOString().split('T')[0]}.xlsx`;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// 发送营销消息给细分客户
export async function sendMarketingMessage(id: number, data: any) {
  return request(`/api/customer-segments/${id}/send-message`, {
    method: 'POST',
    data,
  });
}

// 克隆客户细分
export async function cloneCustomerSegment(id: number, newName: string) {
  return request(`/api/customer-segments/${id}/clone`, {
    method: 'POST',
    data: { name: newName },
  });
}
