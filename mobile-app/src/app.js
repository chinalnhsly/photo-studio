// Taro应用入口文件
import React, { Component } from 'react'
import { View } from '@tarojs/components'
import './app.scss'

// 确保正确初始化Taro环境
class App extends Component {
  componentDidMount() {
    // 全局错误处理
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', event => {
        console.error('未捕获的Promise拒绝:', event.reason);
        event.preventDefault();
      });
    }
  }

  // 在入口组件必须配置，这些函数在小程序中会用到
  componentDidShow() {}
  componentDidHide() {}
  onError(err) {
    console.error('应用错误:', err);
  }

  // 必须添加wrappedRender确保正确初始化
  // this.props.children 是将要会渲染的页面
  render() {
    return <View>{this.props.children}</View>
  }
}

export default App
