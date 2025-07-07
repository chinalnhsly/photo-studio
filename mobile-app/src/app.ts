import { Component } from 'react';
import Taro from '@tarojs/taro';
import { Provider } from 'react-redux';
import configStore from './store';
import './app.scss';

// 引入评价相关的状态管理
import './store/review';

// 全局存储
const store = configStore();

class App extends Component {
  componentDidMount() {
    // 初始化检查登录状态
    this.checkLoginStatus();
    
    // 检查更新
    if (process.env.TARO_ENV === 'weapp') {
      this.checkUpdate();
    }
  }

  // 检查登录状态
  checkLoginStatus() {
    const token = Taro.getStorageSync('token');
    if (!token) {
      console.log('用户未登录');
      // 可以在这里处理未登录状态，例如重定向到登录页或设置全局状态
    }
  }

  // 检查小程序更新
  checkUpdate() {
    if (Taro.canIUse('getUpdateManager')) {
      const updateManager = Taro.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          console.log('有新版本');
          updateManager.onUpdateReady(function () {
            Taro.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (modalRes) {
                if (modalRes.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
          
          updateManager.onUpdateFailed(function () {
            Taro.showModal({
              title: '更新提示',
              content: '新版本下载失败，请检查网络后重试',
              showCancel: false
            });
          });
        }
      });
    }
  }

  // 全局分享设置
  onShareAppMessage() {
    return {
      title: '影楼商城 - 专业摄影服务',
      path: '/pages/home/index'
    };
  }

  // 小程序主页面的配置
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    );
  }
}

export default App;
