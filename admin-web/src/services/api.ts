import * as requestMethods from '../utils/requestMethods';
import request from '@/utils/request';

// 基础API前缀
const API_PREFIX = '/api';

// API路径
const API_PATHS = {
  // 套餐相关
  PACKAGE: {
    LIST: `${API_PREFIX}/packages`,
    DETAIL: (id: number | string) => `${API_PREFIX}/packages/${id}`,
    CREATE: `${API_PREFIX}/packages`,
    UPDATE: (id: number | string) => `${API_PREFIX}/packages/${id}`,
    DELETE: (id: number | string) => `${API_PREFIX}/packages/${id}`,
  },
  
  // 订单相关
  ORDER: {
    LIST: `${API_PREFIX}/orders`,
    DETAIL: (id: number | string) => `${API_PREFIX}/orders/${id}`,
    CREATE: `${API_PREFIX}/orders`,
    UPDATE: (id: number | string) => `${API_PREFIX}/orders/${id}`,
    CANCEL: (id: number | string) => `${API_PREFIX}/orders/${id}/cancel`,
    CONFIRM: (id: number | string) => `${API_PREFIX}/orders/${id}/confirm`,
    COMPLETE: (id: number | string) => `${API_PREFIX}/orders/${id}/complete`,
    PAYMENT: (id: number | string) => `${API_PREFIX}/orders/${id}/payment`,
  },
  
  // 客户相关
  CUSTOMER: {
    LIST: `${API_PREFIX}/customers`,
    DETAIL: (id: number | string) => `${API_PREFIX}/customers/${id}`,
    CREATE: `${API_PREFIX}/customers`,
    UPDATE: (id: number | string) => `${API_PREFIX}/customers/${id}`,
    DELETE: (id: number | string) => `${API_PREFIX}/customers/${id}`,
    TAGS: (id: number | string) => `${API_PREFIX}/customers/${id}/tags`,
  },
  
  // 摄影师相关
  PHOTOGRAPHER: {
    LIST: `${API_PREFIX}/photographers`,
    DETAIL: (id: number | string) => `${API_PREFIX}/photographers/${id}`,
    CREATE: `${API_PREFIX}/photographers`,
    UPDATE: (id: number | string) => `${API_PREFIX}/photographers/${id}`,
    DELETE: (id: number | string) => `${API_PREFIX}/photographers/${id}`,
    SCHEDULE: (id: number | string) => `${API_PREFIX}/photographers/${id}/schedule`,
  },
  
  // 统计数据
  STATISTICS: {
    DASHBOARD: `${API_PREFIX}/statistics/dashboard`,
    SALES: `${API_PREFIX}/statistics/sales`,
    CUSTOMERS: `${API_PREFIX}/statistics/customers`,
    PHOTOGRAPHERS: `${API_PREFIX}/statistics/photographers`,
  },
};

// 统一API服务导出
export default {
  // 套餐API
  package: {
    list: (params?: any) => requestMethods.get(API_PATHS.PACKAGE.LIST, params),
    detail: (id: number | string) => requestMethods.get(API_PATHS.PACKAGE.DETAIL(id)),
    create: (data: any) => requestMethods.post(API_PATHS.PACKAGE.CREATE, data),
    update: (id: number | string, data: any) => requestMethods.put(API_PATHS.PACKAGE.UPDATE(id), data),
    delete: (id: number | string) => requestMethods.del(API_PATHS.PACKAGE.DELETE(id)),
  },
  
  // 订单API
  order: {
    list: (params?: any) => requestMethods.get(API_PATHS.ORDER.LIST, params),
    detail: (id: number | string) => requestMethods.get(API_PATHS.ORDER.DETAIL(id)),
    create: (data: any) => requestMethods.post(API_PATHS.ORDER.CREATE, data),
    update: (id: number | string, data: any) => requestMethods.put(API_PATHS.ORDER.UPDATE(id), data),
    cancel: (id: number | string, reason: string) => requestMethods.post(API_PATHS.ORDER.CANCEL(id), { reason }),
    confirm: (id: number | string) => requestMethods.post(API_PATHS.ORDER.CONFIRM(id)),
    complete: (id: number | string) => requestMethods.post(API_PATHS.ORDER.COMPLETE(id)),
    payment: (id: number | string, data: any) => requestMethods.post(API_PATHS.ORDER.PAYMENT(id), data),
  },
  
  // 客户API
  customer: {
    list: (params?: any) => requestMethods.get(API_PATHS.CUSTOMER.LIST, params),
    detail: (id: number | string) => requestMethods.get(API_PATHS.CUSTOMER.DETAIL(id)),
    create: (data: any) => requestMethods.post(API_PATHS.CUSTOMER.CREATE, data),
    update: (id: number | string, data: any) => requestMethods.put(API_PATHS.CUSTOMER.UPDATE(id), data),
    delete: (id: number | string) => requestMethods.del(API_PATHS.CUSTOMER.DELETE(id)),
    updateTags: (id: number | string, tags: string[]) => requestMethods.put(API_PATHS.CUSTOMER.TAGS(id), { tags }),
  },
  
  // 摄影师API
  photographer: {
    list: (params?: any) => requestMethods.get(API_PATHS.PHOTOGRAPHER.LIST, params),
    detail: (id: number | string) => requestMethods.get(API_PATHS.PHOTOGRAPHER.DETAIL(id)),
    create: (data: any) => requestMethods.post(API_PATHS.PHOTOGRAPHER.CREATE, data),
    update: (id: number | string, data: any) => requestMethods.put(API_PATHS.PHOTOGRAPHER.UPDATE(id), data),
    delete: (id: number | string) => requestMethods.del(API_PATHS.PHOTOGRAPHER.DELETE(id)),
    schedule: (id: number | string, params?: any) => requestMethods.get(API_PATHS.PHOTOGRAPHER.SCHEDULE(id), params),
  },
  
  // 统计数据API
  statistics: {
    dashboard: (params?: any) => requestMethods.get(API_PATHS.STATISTICS.DASHBOARD, params),
    sales: (params?: any) => requestMethods.get(API_PATHS.STATISTICS.SALES, params),
    customers: (params?: any) => requestMethods.get(API_PATHS.STATISTICS.CUSTOMERS, params),
    photographers: (params?: any) => requestMethods.get(API_PATHS.STATISTICS.PHOTOGRAPHERS, params),
  },

  // 销售分析API
  salesAnalytics: {
    getSalesSummary: (params: any) => 
      requestMethods.get(`${API_PREFIX}/analytics/sales/summary`, params),
    getSalesTrend: (params: any) => 
      requestMethods.get(`${API_PREFIX}/analytics/sales/trend`, params),
    getSalesChannels: (params: any) => 
      requestMethods.get(`${API_PREFIX}/analytics/sales/channels`, params),
    getPopularPackages: (params: any) => 
      requestMethods.get(`${API_PREFIX}/analytics/sales/popular-packages`, params),
  },

  // 客户分析API
  customerAnalytics: {
    getCustomerSummary: (params: any) =>
      requestMethods.get(`${API_PREFIX}/analytics/customer/summary`, params),
    getCustomerGrowth: (params: any) =>
      requestMethods.get(`${API_PREFIX}/analytics/customer/growth`, params),
    getCustomerSources: (params: any) =>
      requestMethods.get(`${API_PREFIX}/analytics/customer/sources`, params),
  },

  // 预约管理API
  booking: {
    getBookingList: (params: any) =>
      requestMethods.get(`${API_PREFIX}/booking/list`, params),
    getBookingDetail: (id: string) =>
      requestMethods.get(`${API_PREFIX}/booking/${id}`),
    createBooking: (data: any) =>
      requestMethods.post(`${API_PREFIX}/booking`, data),
    updateBooking: (id: string, data: any) =>
      requestMethods.put(`${API_PREFIX}/booking/${id}`, data),
    deleteBooking: (id: string) =>
      requestMethods.del(`${API_PREFIX}/booking/${id}`),
  },

  // 套餐管理API
  packageManagement: {
    getPackageList: (params: any) =>
      requestMethods.get(`${API_PREFIX}/package/list`, params),
    getPackageDetail: (id: string) =>
      requestMethods.get(`${API_PREFIX}/package/${id}`),
    createPackage: (data: any) =>
      requestMethods.post(`${API_PREFIX}/package`, data),
    updatePackage: (id: string, data: any) =>
      requestMethods.put(`${API_PREFIX}/package/${id}`, data),
    deletePackage: (id: string) =>
      requestMethods.del(`${API_PREFIX}/package/${id}`),
  },

  // 图库管理API
  gallery: {
    getPhotoList: (params: any) => 
      requestMethods.get(`${API_PREFIX}/gallery/photos`, params),
    getPhotoDetail: (id: string) => 
      requestMethods.get(`${API_PREFIX}/gallery/photos/${id}`),
    uploadPhotos: (formData: FormData) =>
      request(`${API_PREFIX}/gallery/upload`, {
        method: 'POST',
        data: formData,
        requestType: 'form',
      }),
    updatePhoto: (id: string, data: any) => 
      requestMethods.put(`${API_PREFIX}/gallery/photos/${id}`, data),
    deletePhoto: (id: string) => 
      requestMethods.del(`${API_PREFIX}/gallery/photos/${id}`),
    getCategoryList: () => 
      requestMethods.get(`${API_PREFIX}/gallery/categories`),
    createCategory: (data: any) => 
      requestMethods.post(`${API_PREFIX}/gallery/categories`, data),
    updateCategory: (id: string, data: any) => 
      requestMethods.put(`${API_PREFIX}/gallery/categories/${id}`, data),
    deleteCategory: (id: string) => 
      requestMethods.del(`${API_PREFIX}/gallery/categories/${id}`),
  },
  
  // 员工管理API
  employee: {
    getEmployeeList: (params: any) => 
      requestMethods.get(`${API_PREFIX}/employees`, params),
    getEmployeeDetail: (id: string) => 
      requestMethods.get(`${API_PREFIX}/employees/${id}`),
    createEmployee: (data: any) => 
      requestMethods.post(`${API_PREFIX}/employees`, data),
    updateEmployee: (id: string, data: any) => 
      requestMethods.put(`${API_PREFIX}/employees/${id}`, data),
    deleteEmployee: (id: string) => 
      requestMethods.del(`${API_PREFIX}/employees/${id}`),
    resetPassword: (id: string) => 
      requestMethods.post(`${API_PREFIX}/employees/${id}/reset-password`),
  },
  
  // 用户认证API
  auth: {
    login: (data: { username: string; password: string }) => 
      requestMethods.post(`${API_PREFIX}/auth/login`, data),
    logout: () => 
      requestMethods.post(`${API_PREFIX}/auth/logout`),
    getProfile: () => 
      requestMethods.get(`${API_PREFIX}/auth/profile`),
    updateProfile: (data: any) => 
      requestMethods.put(`${API_PREFIX}/auth/profile`, data),
    changePassword: (data: { oldPassword: string; newPassword: string }) => 
      requestMethods.put(`${API_PREFIX}/auth/password`, data),
  },
};
