/**
 * 价格格式化
 * @param {number} price - 价格（分）
 * @param {string} prefix - 前缀，默认¥
 * @returns {string} 格式化后的价格
 */
export const formatPrice = (price, prefix = '¥') => {
  if (price === undefined || price === null) return `${prefix}0.00`;
  
  // 如果是分单位，转换为元
  if (price > 10000) {
    price = price / 100;
  }
  
  return `${prefix}${price.toFixed(2)}`;
};

/**
 * 日期格式化
 * @param {Date|string|number} date - 日期对象或时间戳
 * @param {string} format - 格式化模式，默认yyyy-MM-dd
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'yyyy-MM-dd') => {
  if (!date) return '';
  
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();
  
  const padZero = num => String(num).padStart(2, '0');
  
  return format
    .replace('yyyy', year)
    .replace('MM', padZero(month))
    .replace('dd', padZero(day))
    .replace('HH', padZero(hour))
    .replace('mm', padZero(minute))
    .replace('ss', padZero(second));
};

/**
 * 判断是否为空
 * @param {any} value - 要判断的值
 * @returns {boolean} 是否为空
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

export default {
  formatPrice,
  formatDate,
  isEmpty
};
