/**
 * 文本截断工具函数
 * 当CSS截断无法正常工作时，可以使用此函数截断文本
 * @param {string} text 要截断的文本
 * @param {number} maxLength 最大字符数
 * @returns {string} 截断后的文本
 */
export const truncateText = (text, maxLength = 40) => {
  if (!text) return '';
  return text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;
};
