import { message } from 'antd';
import { api } from '@/services/api';

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    // 确保请求头包含正确的 Content-Type
    if (!config.headers['Content-Type'] && (config.method === 'post' || config.method === 'put')) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // 添加认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 统一处理错误
    console.error('API 请求错误:', error);
    
    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response;
      
      if (status === 401) {
        // 未授权，可能需要重新登录
        message.error('登录已过期，请重新登录');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 403) {
        message.error('没有权限执行此操作');
      } else if (status === 404) {
        message.error('请求的资源不存在');
      } else if (status === 500) {
        message.error('服务器错误，请稍后再试');
      } else {
        message.error(data?.message || '请求失败');
      }
    } else if (error.request) {
      // 请求已发送但未收到响应
      message.error('无法连接到服务器，请检查网络连接');
    } else {
      // 请求配置出错
      message.error('请求错误: ' + error.message);
    }
    
    return Promise.reject(error);
  }
);
