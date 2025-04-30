// 组件导出文件 - 所有导出必须在顶层

import ProductCard from './ProductCard';

// 为可能不存在的组件创建空导入
// 这些将被占位组件替代
import CategoryGridFallback from './CategoryGrid/fallback';
import BannerFallback from './Banner/fallback';
import CalendarFallback from './Calendar/fallback';

// 尝试导入真实组件
let CategoryGrid = CategoryGridFallback;
let Banner = BannerFallback;
let Calendar = CalendarFallback;

// 使用直接导入替代动态require
try {
  // 不使用动态导入，直接尝试导入
  const RealCategoryGrid = require('./CategoryGrid').default;
  if (RealCategoryGrid) CategoryGrid = RealCategoryGrid;
} catch (e) {
  console.warn('组件 CategoryGrid 使用占位符');
}

try {
  const RealBanner = require('./Banner').default;
  if (RealBanner) Banner = RealBanner;
} catch (e) {
  console.warn('组件 Banner 使用占位符');
}

try {
  const RealCalendar = require('./Calendar').default;
  if (RealCalendar) Calendar = RealCalendar;
} catch (e) {
  console.warn('组件 Calendar 使用占位符');
}

// 所有导出必须在顶层
export { 
  ProductCard,
  CategoryGrid,
  Banner,
  Calendar
};
