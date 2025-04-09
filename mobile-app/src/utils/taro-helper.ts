// Taro助手函数，避免直接修改类型定义

import Taro from '@tarojs/taro'

// 定义通用回调结果类型，避免依赖Taro的内部类型
interface CallbackResult {
  errMsg: string;
  errCode?: number;
  [key: string]: any;
}

/**
 * 增强版展示分享菜单，支持自定义menus选项
 * @param options 配置选项
 */
export function enhancedShowShareMenu(options: {
  withShareTicket?: boolean
  menus?: string[]
  success?: (res: CallbackResult) => void
  fail?: (res: CallbackResult) => void
  complete?: (res: CallbackResult) => void
}): void {
  // 移除Taro未支持的选项
  const standardOptions = { ...options }
  if ('menus' in standardOptions) {
    delete standardOptions.menus
  }
  
  // 调用原生API
  Taro.showShareMenu(standardOptions)
}
