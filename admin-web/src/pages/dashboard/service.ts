// 修改导入路径，使用相对路径替代 @ 别名
import request from '../../utils/request';

export interface ChartData {
  date: string;
  value: number;
  type: string;
}

export async function getSalesData(): Promise<{ data: ChartData[] }> {
  return request.get('/api/dashboard/sales');
}

export async function getVisitsData(): Promise<{ data: ChartData[] }> {
  return request.get('/api/dashboard/visits');
}

export async function getCustomerData(): Promise<{ data: ChartData[] }> {
  return request.get('/api/dashboard/customers');
}

export async function getOrdersData(): Promise<{ data: { value: number; status: string }[] }> {
  return request.get('/api/dashboard/orders');
}

export async function getStatistics(): Promise<{ 
  data: { 
    totalSales: number;
    totalCustomers: number;
    totalBookings: number;
    totalPhotographers: number;
  } 
}> {
  return request.get('/api/dashboard/statistics');
}

export async function getRecentBookings(): Promise<{ 
  data: { 
    id: string | number;
    customer: string;
    time: string;
    studio: string;
    photographer: string;
    status: string;
  }[] 
}> {
  return request.get('/api/dashboard/recent-bookings');
}

export async function getTopPhotographers(): Promise<{ 
  data: { 
    id: string | number;
    name: string;
    avatar?: string;
    bookings: number;
    rating: number;
  }[] 
}> {
  return request.get('/api/dashboard/top-photographers');
}
