/**
 * 修复 Taro 组件与 React 类型系统的冲突
 * 这个文件使 Taro 组件类型与 React 组件类型兼容
 */

// 重定义 React 组件类型来兼容 Taro
import React from 'react';
import '@tarojs/components';

declare module 'react' {
  // 扩展 React.ReactNode 定义以兼容 Taro 元素
  interface ReactPortal {
    children?: React.ReactNode;
  }

  // 确保 ReactElement 兼容 Taro 组件
  interface FunctionComponentElement<P> {
    type: React.FunctionComponent<P>;
    props: P;
    key: React.Key | null;
  }
}

// 声明 Taro 组件模块，使其与 React 组件系统兼容
declare module '@tarojs/components' {
  // 确保 Taro 组件可以被 JSX 使用
  export interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  
  // 其他 Taro 组件类型声明...
}
