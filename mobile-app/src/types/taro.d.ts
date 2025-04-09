import React from 'react'

// 扩展React命名空间，修复React元素类型问题
declare namespace React {
  // 扩展React.Element类型，使其兼容Taro组件
  interface ReactElement {
    children?: any
  }
  
  // 扩展ReactNode类型，使其兼容Taro组件
  type ReactNode = 
    | ReactElement
    | ReactElement[]
    | string
    | number
    | boolean
    | null
    | undefined;
}

// 修复Taro组件类型
declare module '@tarojs/components' {
  interface SwiperItemProps {
    children?: React.ReactNode
  }
  
  interface ImageProps {
    children?: React.ReactNode
  }
  
  interface ViewProps {
    children?: React.ReactNode
  }
  
  interface TextProps {
    children?: React.ReactNode
  }
}
