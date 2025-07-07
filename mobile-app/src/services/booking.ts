import Taro from '@tarojs/taro';
import { baseUrl } from '../config';

/**
 * 获取可用预约时间槽
 * @param params 查询参数 {date, productId}
 */
export const getAvailableSlots = (params: any) => {
  return Taro.request({
    url: `${baseUrl}/bookings/availableSlots`,
    method: 'GET',
    data: params
  });
};

/**
 * 创建预约
 * @param data 预约数据
 */
export const createBooking = (data: any) => {
  return Taro.request({
    url: `${baseUrl}/bookings`,
    method: 'POST',
    data
  });
};

/**
 * 获取预约详情
 * @param id 预约ID
 */
export const getBookingDetail = (id: number) => {
  return Taro.request({
    url: `${baseUrl}/bookings/${id}`,
    method: 'GET'
  });
};

/**
 * 获取用户预约列表
 * @param params 查询参数 {page, limit, status}
 */
export const getUserBookings = (params: any) => {
  return Taro.request({
    url: `${baseUrl}/bookings/user`,
    method: 'GET',
    data: params
  });
};

/**
 * 取消预约
 * @param id 预约ID
 * @param reason 取消原因
 */
export const cancelBooking = (id: number, reason?: string) => {
  return Taro.request({
    url: `${baseUrl}/bookings/${id}/cancel`,
    method: 'POST',
    data: { reason }
  });
};

/**
 * 重新安排预约
 * @param id 预约ID
 * @param data 新的预约数据
 */
export const rescheduleBooking = (id: number, data: any) => {
  return Taro.request({
    url: `${baseUrl}/bookings/${id}/reschedule`,
    method: 'POST',
    data
  });
};

/**
 * 获取日历预约视图
 * @param params 查询参数 {start, end}
 */
export const getBookingCalendar = (params: any) => {
  return Taro.request({
    url: `${baseUrl}/bookings/calendar`,
    method: 'GET',
    data: params
  });
};
