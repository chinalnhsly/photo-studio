import  request  from 'umi-request';
import { OrderStatus, OrderQueryParams } from '../types/order';

// 获取订单列表
export async function getOrderList(params?: OrderQueryParams) {
  return request('/api/orders', {
    method: 'GET',
    params,
  });
}

// 获取订单详情
export async function getOrderById(id: number) {
  return request(`/api/orders/${id}`, {
    method: 'GET',
  });
}

// 创建新订单
export async function createOrder(data: any) {
  return request('/api/orders', {
    method: 'POST',
    data,
  });
}

// 更新订单信息
export async function updateOrder(id: number, data: any) {
  return request(`/api/orders/${id}`, {
    method: 'PUT',
    data,
  });
}

// 更新订单状态
export async function updateOrderStatus(id: number, status: OrderStatus) {
  return request(`/api/orders/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
}

// 删除订单
export async function deleteOrder(id: number) {
  return request(`/api/orders/${id}`, {
    method: 'DELETE',
  });
}

// 确认订单支付
export async function confirmOrderPayment(id: number, paymentData: any) {
  return request(`/api/orders/${id}/payment`, {
    method: 'POST',
    data: paymentData,
  });
}

// 申请订单退款
export async function requestOrderRefund(id: number, refundData: any) {
  return request(`/api/orders/${id}/refund`, {
    method: 'POST',
    data: refundData,
  });
}

// 添加订单备注
export async function addOrderNote(id: number, note: string) {
  return request(`/api/orders/${id}/notes`, {
    method: 'POST',
    data: { content: note },
  });
}

// 获取订单备注历史
export async function getOrderNotes(id: number) {
  return request(`/api/orders/${id}/notes`, {
    method: 'GET',
  });
}

// 发送订单确认邮件
export async function sendOrderConfirmation(id: number) {
  return request(`/api/orders/${id}/send-confirmation`, {
    method: 'POST',
  });
}

// 获取订单统计数据
export async function getOrderStatistics(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return request('/api/orders/statistics', {
    method: 'GET',
    params,
  });
}

// 导出订单
export async function exportOrders(params?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}) {
  return request('/api/orders/export', {
    method: 'GET',
    params,
    responseType: 'blob',
  }).then(blob => {
    const fileName = `订单报表_${new Date().toISOString().split('T')[0]}.xlsx`;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// 打印订单
export async function printOrder(id: number) {
  return request(`/api/orders/${id}/print`, {
    method: 'GET',
  });
}

// 批量更新订单状态
export async function bulkUpdateOrderStatus(ids: number[], status: OrderStatus) {
  return request('/api/orders/bulk-update-status', {
    method: 'POST',
    data: { ids, status },
  });
}

// 获取指定客户的订单列表
export async function getCustomerOrders(customerId: number, params?: OrderQueryParams) {
  return request(`/api/customers/${customerId}/orders`, {
    method: 'GET',
    params,
  });
}
