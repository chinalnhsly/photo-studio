import Taro from '@tarojs/taro';

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 用户API服务
export const userApi = {
  /**
   * 模拟登录接口
   * @param {Object} params - 登录参数
   * @returns {Promise<Object>} 登录结果
   */
  login: async (params) => {
    await delay(1000);
    
    // 这里可以模拟一些简单的验证
    if (!params.phone || !params.password) {
      return {
        success: false,
        message: '手机号和密码不能为空'
      };
    }
    
    // 模拟成功登录
    return {
      success: true,
      token: 'simulated_token_' + Date.now(),
      userInfo: {
        id: '1',
        name: '测试用户',
        phone: params.phone,
        avatar: 'https://placehold.co/100/E6E6FA/333?text=头像',
        level: 'VIP会员'
      }
    };
  },
  
  /**
   * 模拟获取用户信息
   * @returns {Promise<Object>} 用户信息
   */
  getUserInfo: async () => {
    await delay(500);
    
    // 检查是否已登录（本地模拟）
    const userInfo = Taro.getStorageSync('userInfo');
    if (userInfo) {
      return userInfo;
    }
    
    // 返回模拟用户信息
    return {
      id: '1',
      name: '测试用户',
      phone: '1381234****',
      avatar: 'https://placehold.co/100/E6E6FA/333?text=头像',
      level: 'VIP会员'
    };
  },
  
  /**
   * 模拟退出登录
   * @returns {Promise<Object>} 退出结果
   */
  logout: async () => {
    await delay(500);
    
    // 清除本地存储
    Taro.removeStorageSync('userInfo');
    Taro.removeStorageSync('token');
    
    return {
      success: true
    };
  }
};

export default userApi;
