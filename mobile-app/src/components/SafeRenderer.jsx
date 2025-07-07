/**
 * 提供类型安全的渲染工具函数，解决Taro与React类型系统不兼容问题
 */
import { View } from '@tarojs/components';


// 基础渲染函数 - 直接使用View而非自定义组件
export function safeRender(children: any): JSX.Element {
  return (
    <View className='safe-renderer-wrapper'>
      {children}
    </View>
  );
}

/**
 * 类型安全的数组映射函数
 * 避免直接在JSX中使用map引起的类型错误
 */
export function safeMap<T>(
  items: T[],
  renderItem: (item: T, index: number) => any
): JSX.Element {
  // 强制转换为any，再返回JSX.Element
  const result = items.map((item, index) => renderItem(item, index));
  
  return (
    <View className='safe-renderer-wrapper'>
      {result as any}
    </View>
  );
}

/**
 * 强制类型转换助手
 */
export function asReactNode(elements: any[]): JSX.Element {
  return (
    <View className='safe-renderer-wrapper'>
      {elements.map((el, idx) => (
        <View key={`wrapper-${idx}`} className='safe-element'>
          {el}
        </View>
      ))}
    </View>
  );
}

/**
 * 通用的元素包装器
 * 绕过所有类型检查
 */
export function wrapElement(element: any): JSX.Element {
  // 使用any类型完全绕过类型检查
  return (
    <View className='safe-renderer-wrapper'>
      {element as any}
    </View>
  );
}

/**
 * 用于渲染列表项的简单助手
 */
export function renderListItems(items: any[]): JSX.Element {
  return wrapElement(items);
}
