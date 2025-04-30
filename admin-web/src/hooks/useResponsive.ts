import { useState, useEffect } from 'react';

// 定义屏幕尺寸断点
export const BREAK_POINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface ResponsiveInfo {
  // 当前屏幕尺寸
  screenSize: ScreenSize;
  
  // 是否移动设备
  isMobile: boolean;
  
  // 是否平板设备
  isTablet: boolean;
  
  // 是否桌面设备
  isDesktop: boolean;
  
  // 屏幕宽度
  screenWidth: number;
  
  // 是否小于指定尺寸
  lessThan: (size: ScreenSize) => boolean;
  
  // 是否大于指定尺寸
  greaterThan: (size: ScreenSize) => boolean;
  
  // 是否为指定尺寸
  isSize: (size: ScreenSize) => boolean;
  
  // 特定断点匹配方法 - 新增部分
  // 是否为特定大小
  isXS: boolean;
  isSM: boolean;
  isMD: boolean;
  isLG: boolean;
  isXL: boolean;
  isXXL: boolean;
  
  // 是否大于等于特定大小
  isUpXS: boolean;
  isUpSM: boolean;
  isUpMD: boolean;
  isUpLG: boolean;
  isUpXL: boolean;
  isUpXXL: boolean;
  
  // 是否小于等于特定大小
  isDownXS: boolean;
  isDownSM: boolean;
  isDownMD: boolean;
  isDownLG: boolean;
  isDownXL: boolean;
  isDownXXL: boolean;
}

/**
 * 响应式布局钩子
 * 
 * 提供当前屏幕尺寸和设备类型的信息
 */
export function useResponsive(): ResponsiveInfo {
  // 获取当前窗口宽度
  const getWindowWidth = () => window.innerWidth;
  
  // 初始状态
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== 'undefined' ? getWindowWidth() : BREAK_POINTS.lg
  );
  
  // 根据宽度确定尺寸
  const getScreenSize = (width: number): ScreenSize => {
    if (width < BREAK_POINTS.xs) return 'xs';
    if (width < BREAK_POINTS.sm) return 'sm';
    if (width < BREAK_POINTS.md) return 'md';
    if (width < BREAK_POINTS.lg) return 'lg';
    if (width < BREAK_POINTS.xl) return 'xl';
    return 'xxl';
  };
  
  // 当前尺寸
  const screenSize = getScreenSize(screenWidth);
  
  // 设备类型判断
  const isMobile = screenSize === 'xs' || screenSize === 'sm';
  const isTablet = screenSize === 'md' || screenSize === 'lg';
  const isDesktop = screenSize === 'xl' || screenSize === 'xxl';
  
  // 尺寸比较函数
  const lessThan = (size: ScreenSize): boolean => {
    const currentIndex = Object.keys(BREAK_POINTS).indexOf(screenSize);
    const targetIndex = Object.keys(BREAK_POINTS).indexOf(size);
    return currentIndex < targetIndex;
  };
  
  const greaterThan = (size: ScreenSize): boolean => {
    const currentIndex = Object.keys(BREAK_POINTS).indexOf(screenSize);
    const targetIndex = Object.keys(BREAK_POINTS).indexOf(size);
    return currentIndex > targetIndex;
  };
  
  const isSize = (size: ScreenSize): boolean => screenSize === size;
  
  // 监听窗口大小变化
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setScreenWidth(getWindowWidth());
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 计算特定断点属性
  // 是否为特定大小
  const isXS = screenSize === 'xs';
  const isSM = screenSize === 'sm';
  const isMD = screenSize === 'md';
  const isLG = screenSize === 'lg';
  const isXL = screenSize === 'xl';
  const isXXL = screenSize === 'xxl';
  
  // 是否大于等于特定大小
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  const currentSizeIndex = sizes.indexOf(screenSize);
  
  const isUpXS = currentSizeIndex >= sizes.indexOf('xs');
  const isUpSM = currentSizeIndex >= sizes.indexOf('sm');
  const isUpMD = currentSizeIndex >= sizes.indexOf('md');
  const isUpLG = currentSizeIndex >= sizes.indexOf('lg');
  const isUpXL = currentSizeIndex >= sizes.indexOf('xl');
  const isUpXXL = currentSizeIndex >= sizes.indexOf('xxl');
  
  // 是否小于等于特定大小
  const isDownXS = currentSizeIndex <= sizes.indexOf('xs');
  const isDownSM = currentSizeIndex <= sizes.indexOf('sm');
  const isDownMD = currentSizeIndex <= sizes.indexOf('md');
  const isDownLG = currentSizeIndex <= sizes.indexOf('lg');
  const isDownXL = currentSizeIndex <= sizes.indexOf('xl');
  const isDownXXL = currentSizeIndex <= sizes.indexOf('xxl');
  
  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    lessThan,
    greaterThan,
    isSize,
    // 添加特定断点属性
    isXS,
    isSM,
    isMD,
    isLG,
    isXL,
    isXXL,
    isUpXS,
    isUpSM,
    isUpMD,
    isUpLG,
    isUpXL,
    isUpXXL,
    isDownXS,
    isDownSM,
    isDownMD,
    isDownLG,
    isDownXL,
    isDownXXL,
  };
}

export default useResponsive;
