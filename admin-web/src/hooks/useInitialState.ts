import { useState, useEffect } from 'react';

/**
 * 模拟 useModel 钩子
 * 提供全局初始状态
 */
export function useInitialState() {
  const [initialState, setInitialState] = useState({
    name: '摄影工作室管理系统',
    version: '1.0.0',
    currentUser: {
      name: '管理员',
      avatar: '',
      userId: '1',
      email: 'admin@example.com',
      signature: '',
      title: '系统管理员',
      group: '管理员组',
      permissions: ['admin']
    },
    settings: {
      navTheme: 'dark',
      primaryColor: '#1890ff',
      layout: 'side',
      contentWidth: 'Fluid',
      fixedHeader: false,
      fixSiderbar: false,
      title: '摄影工作室管理系统',
      pwa: false,
    }
  });

  // 更新状态的函数
  const setInitial = (state: any) => {
    setInitialState(prev => ({
      ...prev,
      ...state
    }));
  };

  return {
    initialState,
    setInitialState: setInitial,
    loading: false
  };
}

export default useInitialState;
