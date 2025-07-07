import { RequestOptionsInit } from 'umi-request';
import request from './request';

/**
 * GET 请求方法
 * @param url 请求路径
 * @param params 查询参数
 * @param options 请求选项
 */
export async function get<T = any>(
  url: string,
  params?: any,
  options?: RequestOptionsInit
): Promise<T> {
  const requestOptions: RequestOptionsInit = {
    method: 'GET',
    params,
    ...(options || {}),
  };
  return request<T>(url, requestOptions);
}

/**
 * POST 请求方法
 * @param url 请求路径
 * @param data 请求体数据
 * @param options 请求选项
 */
export async function post<T = any>(
  url: string,
  data?: any,
  options?: RequestOptionsInit
): Promise<T> {
  const requestOptions: RequestOptionsInit = {
    method: 'POST',
    data,
    ...(options || {}),
  };
  return request<T>(url, requestOptions);
}

/**
 * PUT 请求方法
 * @param url 请求路径
 * @param data 请求体数据
 * @param options 请求选项
 */
export async function put<T = any>(
  url: string,
  data?: any,
  options?: RequestOptionsInit
): Promise<T> {
  const requestOptions: RequestOptionsInit = {
    method: 'PUT',
    data,
    ...(options || {}),
  };
  return request<T>(url, requestOptions);
}

/**
 * DELETE 请求方法
 * @param url 请求路径
 * @param options 请求选项
 */
export async function del<T = any>(
  url: string,
  options?: RequestOptionsInit
): Promise<T> {
  const requestOptions: RequestOptionsInit = {
    method: 'DELETE',
    ...(options || {}),
  };
  return request<T>(url, requestOptions);
}

/**
 * PATCH 请求方法
 * @param url 请求路径
 * @param data 请求体数据
 * @param options 请求选项
 */
export async function patch<T = any>(
  url: string,
  data?: any,
  options?: RequestOptionsInit
): Promise<T> {
  const requestOptions: RequestOptionsInit = {
    method: 'PATCH',
    data,
    ...(options || {}),
  };
  return request<T>(url, requestOptions);
}

/**
 * 下载文件
 * @param url 请求路径
 * @param params 查询参数
 * @param filename 保存的文件名
 */
export async function downloadFile(
  url: string,
  params?: Record<string, any>,
  filename?: string
): Promise<void> {
  const requestOptions: RequestOptionsInit = {
    method: 'GET',
    params,
    responseType: 'blob',
  };
  
  const blob = await request<Blob>(url, requestOptions);
  
  // 创建下载链接
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

/**
 * 上传文件
 * @param url 请求路径
 * @param file 文件对象
 * @param name 文件字段名
 * @param data 其他表单数据
 */
export async function uploadFile<T = any>(
  url: string,
  file: File | Blob,
  name: string = 'file',
  data?: Record<string, any>
): Promise<T> {
  const formData = new FormData();
  formData.append(name, file);
  
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }
  
  const requestOptions: RequestOptionsInit = {
    method: 'POST',
    data: formData,
    requestType: 'form',
  };
  
  return request<T>(url, requestOptions);
}

/**
 * 文件上传方法
 * @param url 上传接口地址
 * @param file 文件对象
 * @param extraData 额外表单字段
 * @param options 其他 request 配置
 */
export async function upload(
  url: string,
  file: File,
  extraData?: Record<string, any>,
  options?: Record<string, any>
) {
  const formData = new FormData();
  formData.append('file', file);
  if (extraData) {
    Object.keys(extraData).forEach(key => {
      formData.append(key, extraData[key]);
    });
  }
  return request(url, {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...options,
  });
}

export default {
  get,
  post,
  put,
  del,
  patch,
  downloadFile,
  uploadFile,
  upload,
};
