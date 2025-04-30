import { extend } from 'umi-request';
import { message } from 'antd';

// 创建请求实例
const request = extend({
  prefix: '',
  timeout: 10000,
  errorHandler: (error) => {
    message.error(error.message || '请求失败');
    throw error;
  }
});

// 请求拦截器
request.interceptors.request.use((url, options) => {
  // 添加认证信息等
  return { url, options };
});

// 响应拦截器
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  
  // 统一处理后端返回的错误
  if (data && !data.success) {
    message.error(data.message || '操作失败');
  }
  
  return response;
});

export default request;
