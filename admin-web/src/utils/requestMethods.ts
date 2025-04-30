import request from './request';
// 导入必要的类型
import type { RequestOptionsInit } from 'umi-request';

// 创建一个完全独立的新接口，而不是扩展现有接口
export interface CustomRequestOptions {
  params?: Record<string, any>;
  data?: any;
  responseType?: 'blob' | 'text' | 'json' | 'arrayBuffer';
  headers?: Record<string, string>;
  // 可以添加其他需要的属性
}

/**
 * 通用GET请求方法
 * @param url API路径
 * @param params 查询参数
 * @returns Promise
 */
export function get<T = any>(url: string, params?: any, options?: CustomRequestOptions): Promise<T> {
  // 使用类型断言转换为request接受的类型
  return request.get(url, params, options as any);
}

/**
 * 通用POST请求方法
 * @param url API路径
 * @param data 请求体数据
 * @returns Promise
 */
export function post<T = any>(url: string, data?: any, options?: CustomRequestOptions): Promise<T> {
  return request.post(url, data, options as any);
}

/**
 * 通用PUT请求方法
 * @param url API路径
 * @param data 请求体数据
 * @returns Promise
 */
export function put<T = any>(url: string, data?: any, options?: CustomRequestOptions): Promise<T> {
  return request.put(url, data, options as any);
}

/**
 * 通用DELETE请求方法
 * @param url API路径
 * @returns Promise
 */
export function del<T = any>(url: string, options?: CustomRequestOptions): Promise<T> {
  return request.delete(url, options as any);
}

/**
 * 文件上传方法
 * @param url API路径
 * @param formData FormData对象
 * @returns Promise
 */
export function upload<T = any>(url: string, formData: FormData): Promise<T> {
  // 对于FormData，不要设置Content-Type，让浏览器自动处理
  const requestOptions: RequestOptionsInit = {
    // 不设置任何headers，让浏览器自动添加正确的Content-Type
  };
  
  return request.post(url, formData, requestOptions);
}

/**
 * 文件下载方法
 * @param url API路径
 * @param params 查询参数
 * @param filename 下载后的文件名
 * @returns Promise
 */
export async function download(url: string, params?: any, filename?: string): Promise<Blob> {
  // 使用带有类型断言的对象
  const response = await request.get(url, params, {
    responseType: 'blob'
  } as any);
  
  // 如果指定了文件名，则执行下载
  if (filename && response instanceof Blob) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(response);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  
  return response;
}

export default {
  get,
  post,
  put,
  delete: del,
  upload,
  download,
};
