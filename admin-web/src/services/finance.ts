import  request  from 'umi-request';
import { TransactionType } from '../types/finance';

// 获取财务摘要数据
export async function getFinancialSummary(params: {
  startDate?: string;
  endDate?: string;
}) {
  return request('/api/finance/summary', {
    method: 'GET',
    params,
  });
}

// 获取按周期分组的收入数据
export async function getRevenueByPeriod(params: {
  startDate: string;
  endDate: string;
  periodType: 'daily' | 'weekly' | 'monthly';
}) {
  return request('/api/finance/revenue/trend', {
    method: 'GET',
    params,
  });
}

// 获取按分类分组的收入数据
export async function getRevenueByCategory(params: {
  startDate: string;
  endDate: string;
}) {
  return request('/api/finance/revenue/category', {
    method: 'GET',
    params,
  });
}

// 获取按支付方式分组的收入数据
export async function getRevenueByPaymentMethod(params: {
  startDate: string;
  endDate: string;
}) {
  return request('/api/finance/revenue/payment-method', {
    method: 'GET',
    params,
  });
}

// 获取交易记录
export async function getTransactions(params: {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}) {
  return request('/api/finance/transactions', {
    method: 'GET',
    params,
  });
}

// 创建交易记录
export async function createTransaction(data: {
  date: string;
  amount: number;
  type: TransactionType;
  paymentMethod: string;
  categoryId?: number;
  customerId?: number;
  orderId?: number;
  description?: string;
  attachments?: string[];
}) {
  return request('/api/finance/transactions', {
    method: 'POST',
    data,
  });
}

// 更新交易记录
export async function updateTransaction(id: number, data: {
  date?: string;
  amount?: number;
  type?: TransactionType;
  paymentMethod?: string;
  categoryId?: number;
  customerId?: number;
  orderId?: number;
  description?: string;
  attachments?: string[];
}) {
  return request(`/api/finance/transactions/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除交易记录
export async function deleteTransaction(id: number) {
  return request(`/api/finance/transactions/${id}`, {
    method: 'DELETE',
  });
}

// 获取收支类别
export async function getTransactionCategories() {
  return request('/api/finance/categories', {
    method: 'GET',
  });
}

// 创建收支类别
export async function createTransactionCategory(data: {
  name: string;
  type: 'income' | 'expense';
  parentId?: number;
}) {
  return request('/api/finance/categories', {
    method: 'POST',
    data,
  });
}

// 更新收支类别
export async function updateTransactionCategory(id: number, data: {
  name?: string;
  type?: 'income' | 'expense';
  parentId?: number;
}) {
  return request(`/api/finance/categories/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除收支类别
export async function deleteTransactionCategory(id: number) {
  return request(`/api/finance/categories/${id}`, {
    method: 'DELETE',
  });
}

// 导出财务数据
export async function exportFinancialData(params: {
  startDate: string;
  endDate: string;
  type?: string;
}) {
  return request('/api/finance/export', {
    method: 'GET',
    params,
    responseType: 'blob',
  });
}

// 获取年度报表数据
export async function getAnnualReport(year: number) {
  return request('/api/finance/reports/annual', {
    method: 'GET',
    params: { year },
  });
}

// 获取月度报表数据
export async function getMonthlyReport(year: number, month: number) {
  return request('/api/finance/reports/monthly', {
    method: 'GET',
    params: { year, month },
  });
}
