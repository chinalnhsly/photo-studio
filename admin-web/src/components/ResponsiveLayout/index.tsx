import React from 'react';
// 修改导入路径，使用相对路径而不是别名
import { useResponsive } from '../../hooks/useResponsive';

// 响应式组件基础属性
interface ResponsiveProps {
  children: React.ReactNode;
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  direction?: 'up' | 'down';
}

// 响应式布局组件属性
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  mobileRender?: React.ReactNode;
  tabletRender?: React.ReactNode;
  desktopRender?: React.ReactNode;
}

// 高于特定断点显示
export const ShowAbove: React.FC<ResponsiveProps> = ({ 
  children, 
  breakpoint = 'md', 
}) => {
  const responsive = useResponsive();
  
  const isVisible = () => {
    switch (breakpoint) {
      case 'xs': return responsive.isUpXS;
      case 'sm': return responsive.isUpSM;
      case 'md': return responsive.isUpMD;
      case 'lg': return responsive.isUpLG;
      case 'xl': return responsive.isUpXL;
      case 'xxl': return responsive.isUpXXL;
      default: return true;
    }
  };
  
  return isVisible() ? <>{children}</> : null;
};

// 低于特定断点显示
export const ShowBelow: React.FC<ResponsiveProps> = ({ 
  children, 
  breakpoint = 'md', 
}) => {
  const responsive = useResponsive();
  
  const isVisible = () => {
    switch (breakpoint) {
      case 'xs': return responsive.isDownXS;
      case 'sm': return responsive.isDownSM;
      case 'md': return responsive.isDownMD;
      case 'lg': return responsive.isDownLG;
      case 'xl': return responsive.isDownXL;
      case 'xxl': return responsive.isDownXXL;
      default: return true;
    }
  };
  
  return isVisible() ? <>{children}</> : null;
};

// 仅在特定断点显示
export const ShowAt: React.FC<ResponsiveProps> = ({ 
  children, 
  breakpoint = 'md', 
}) => {
  const responsive = useResponsive();
  
  const isVisible = () => {
    switch (breakpoint) {
      case 'xs': return responsive.isXS;
      case 'sm': return responsive.isSM;
      case 'md': return responsive.isMD;
      case 'lg': return responsive.isLG;
      case 'xl': return responsive.isXL;
      case 'xxl': return responsive.isXXL;
      default: return true;
    }
  };
  
  return isVisible() ? <>{children}</> : null;
};

// 仅在移动端显示
export const Mobile: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const responsive = useResponsive();
  return responsive.isMobile ? <>{children}</> : null;
};

// 仅在平板显示
export const Tablet: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const responsive = useResponsive();
  return responsive.isTablet ? <>{children}</> : null;
};

// 仅在桌面端显示
export const Desktop: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const responsive = useResponsive();
  return responsive.isDesktop ? <>{children}</> : null;
};

// 通用响应组件
export const Responsive: React.FC<ResponsiveProps> = ({ 
  children, 
  breakpoint = 'md', 
  direction = 'up' 
}) => {
  return direction === 'up' ? (
    <ShowAbove breakpoint={breakpoint}>{children}</ShowAbove>
  ) : (
    <ShowBelow breakpoint={breakpoint}>{children}</ShowBelow>
  );
};

/**
 * 响应式布局组件
 * 
 * 根据不同设备尺寸渲染不同内容
 */
const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  mobileRender,
  tabletRender,
  desktopRender,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  // 移动端渲染
  if (isMobile && mobileRender) {
    return <>{mobileRender}</>;
  }
  
  // 平板渲染
  if (isTablet && tabletRender) {
    return <>{tabletRender}</>;
  }
  
  // 桌面端渲染
  if (isDesktop && desktopRender) {
    return <>{desktopRender}</>;
  }
  
  // 默认渲染
  return <>{children}</>;
};

export default ResponsiveLayout;
