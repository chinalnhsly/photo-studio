// 全局类型声明，用于修复Taro和React类型冲突

import React from 'react';
import { ReactNode } from 'react';

// 为ReactElement添加缺失的children属性
declare module 'react' {
  interface ReactElement {
    children?: ReactNode;
  }
  
  // 修改ReactNode定义为更为宽松的类型
  type ReactNode = 
    | ReactElement
    | ReactElement[]
    | string
    | number
    | boolean
    | null
    | undefined
    | any; // 通过any类型绕过严格检查
}

// 扩展Taro组件的类型定义
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      [key: string]: any;
    }
  }
}
