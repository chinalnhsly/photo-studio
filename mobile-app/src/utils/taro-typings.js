// Taro类型扩展文件

import '@tarojs/taro'

// 扩展Taro的类型定义
declare module '@tarojs/taro' {
  // 扩展showShareMenu方法的Option类型
  namespace showShareMenu {
    interface Option {
      // 修改为可选属性，与原始定义保持一致
      withShareTicket?: boolean
      menus?: string[] // 添加menus选项支持
      success?: (res: TaroGeneral.CallbackResult) => void
      fail?: (res: TaroGeneral.CallbackResult) => void
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }
}
