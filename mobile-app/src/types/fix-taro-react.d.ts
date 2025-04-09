// 解决Taro与React类型系统冲突的类型定义

// 确保我们使用同一套React类型定义
import React from 'react';

// 扩展React命名空间，提供正确的类型定义
declare module 'react' {
  // 确保ReactElement支持可选的children属性
  interface ReactElement {
    children?: React.ReactNode;
  }
  
  // 确保ReactPortal类型不要求必须的children属性
  interface ReactPortal {
    children?: React.ReactNode; 
  }
}

// 扩展Taro组件的类型定义
declare module '@tarojs/components' {
  import { ComponentType } from 'react';
  
  // 定义一个通用的TaroComponent类型来替代原始组件类型
  type TaroComponent<P> = React.FC<P>;
  
  // 重新导出Taro组件，使用兼容的类型
  export const View: TaroComponent<any>;
  export const Text: TaroComponent<any>;
  export const Image: TaroComponent<any>;
  export const Swiper: TaroComponent<any>;
  export const SwiperItem: TaroComponent<any>;
  export const ScrollView: TaroComponent<any>;
}
