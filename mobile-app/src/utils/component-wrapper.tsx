import React from 'react'
import { View } from '@tarojs/components'

/**
 * 用于包装React函数组件，使其能够在Taro环境中使用
 * 解决类型不兼容问题
 */
export function wrapComponent<P extends Record<string, any>>(
  Component: React.FC<P> | React.ComponentType<P>
) {
  return function WrappedComponent(props: P) {
    return (
      <View className="component-wrapper">
        {/* 通过简单的React元素包装，解决类型不兼容问题 */}
        {React.createElement(Component, props as any)}
      </View>
    );
  };
}
