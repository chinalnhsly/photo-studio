import Taro from '@tarojs/taro';
import { baseUrl } from '../config';

/**
 * 获取摄影师列表
 * @param params 查询参数
 */
export const getPhotographers = (params?: any) => {
  return Taro.request({
    url: `${baseUrl}/photographers`,
    method: 'GET',
    data: params
  });
};

/**
 * 获取摄影师详情
 * @param id 摄影师ID
 */
export const getPhotographerDetail = (id: number) => {
  return Taro.request({
    url: `${baseUrl}/photographers/${id}`,
    method: 'GET'
  });
};

/**
 * 获取热门摄影师
 * @param limit 数量限制
 */
export const getPopularPhotographers = (limit: number = 5) => {
  return Taro.request({
    url: `${baseUrl}/photographers/popular/list`,
    method: 'GET',
    data: { limit }
  });
};

/**
 * 获取摄影风格列表
 */
export const getPhotographStyles = () => {
  return Taro.request({
    url: `${baseUrl}/photographers/styles/all`,
    method: 'GET'
  });
};

/**
 * 获取摄影师可用时间段
 * @param photographerId 摄影师ID
 * @param startDate 开始日期 (YYYY-MM-DD)
 * @param endDate 结束日期 (YYYY-MM-DD)
 */
export const getPhotographerAvailability = (
  photographerId: number,
  startDate: string,
  endDate: string
) => {
  return Taro.request({
    url: `${baseUrl}/photographers/${photographerId}/available-slots`,
    method: 'GET',
    data: { startDate, endDate }
  });
};

/**
 * 根据摄影师预约
 * @param data 预约数据
 */
export const bookPhotographer = (data: any) => {
  return Taro.request({
    url: `${baseUrl}/bookings/photographer`,
    method: 'POST',
    data
  });
};
