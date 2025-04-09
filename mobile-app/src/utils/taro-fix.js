/**
 * 工具函数，用于解决Taro与React类型系统冲突问题
 */

// 将数组渲染转换为可接受的ReactNode
export function renderList(items, renderItem) {
  return items.map(renderItem);
}

// 安全调用Taro API
export function safeShowShareMenu(options) {
  // 兼容处理，移除可能导致类型错误的属性
  const safeOptions = { ...options };
  if (safeOptions.menus) {
    delete safeOptions.menus;
  }
  
  try {
    return Taro.showShareMenu(safeOptions);
  } catch (error) {
    console.error('showShareMenu error', error);
    // 兼容降级处理
    return Taro.showShareMenu({ withShareTicket: true });
  }
}

// 兼容版本检查
export function getAvailableMenus() {
  try {
    const systemInfo = Taro.getSystemInfoSync();
    // 根据平台和SDK版本返回可用分享菜单
    if (systemInfo.platform === 'ios' && parseInt(systemInfo.SDKVersion) >= 2.11) {
      return ['shareAppMessage', 'shareTimeline'];
    }
    return ['shareAppMessage']; // 兼容版本只支持分享给朋友
  } catch (error) {
    return ['shareAppMessage']; // 默认至少支持分享给朋友
  }
}
