/**
 * React 和 Taro 类型兼容层
 * 用于解决"不能将类型"Element[]"分配给类型"ReactNode""等类型错误
 */

import React from 'react';

/**
 * 创建一个类型兼容的渲染函数
 * 用于安全渲染可能导致类型错误的元素数组
 */
export function renderElements(elements: React.ReactElement[]): React.ReactNode {
  return React.createElement(React.Fragment, {}, ...elements);
}

/**
 * 包装器组件，用于渲染可能会导致类型错误的子元素
 */
export const ElementWrapper: React.FC<{
  children: React.ReactElement | React.ReactElement[];
}> = ({ children }) => {
  // 使用类型断言确保类型安全
  return React.createElement(React.Fragment, {}, children as React.ReactNode);
};

/**
 * 类型兼容的列表渲染助手
 */
export function renderList<T>(
  items: T[],
  renderItem: (item: T, index: number) => React.ReactElement
): React.ReactNode {
  return React.createElement(
    React.Fragment, 
    {}, 
    ...items.map((item, index) => renderItem(item, index))
  );
}

/**
 * 类型安全的 map 函数，用于替换直接使用 array.map
 */
export function safeMap<T>(
  items: T[],
  callback: (item: T, index: number) => React.ReactElement
): React.ReactNode {
  return React.createElement(
    React.Fragment,
    {},
    ...items.map(callback)
  );
}

// 将 Element 类型转为 ReactNode 类型的断言助手
export function asReactNode(element: React.ReactElement): React.ReactNode {
  return element as unknown as React.ReactNode;
}
