import Taro from '@tarojs/taro';
import { DateInfo } from '../components/DatePicker';
import { BASE_URL } from '../config';

/**
 * 获取产品的可预约日期和时间段
 * @param productId 产品ID
 * @returns 可预约日期和时间段
 */
export const getAvailableDates = (productId: number) => {
  return Taro.request<{
    code: number;
    message: string;
    data: DateInfo[];
  }>({
    url: `${BASE_URL}/api/appointment/available-dates`,
    method: 'GET',
    data: { productId }
  });
};

/**
 * 创建预约
 * @param data 预约数据
 */
export const createAppointment = (data: {
  productId: number;
  date: string;
  timeSlotId: string;
  customerName: string;
  customerPhone: string;
  remark?: string;
}) => {
  return Taro.request({
    url: `${BASE_URL}/api/appointment/create`,
    method: 'POST',
    data
  });
};

/**
 * 检查时间段是否可用
 * @param productId 产品ID
 * @param date 日期
 * @param timeSlotId 时间段ID
 */
export const checkTimeSlotAvailability = (productId: number, date: string, timeSlotId: string) => {
  return Taro.request<{
    code: number;
    message: string;
    data: {
      available: boolean;
      reason?: string;
    }
  }>({
    url: `${BASE_URL}/api/appointment/check-availability`,
    method: 'GET',
    data: { productId, date, timeSlotId }
  });
};
