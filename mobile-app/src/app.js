// Taro应用入口文件
import React, { Component } from 'react'
import './app.scss'

class App extends Component {
  componentDidMount() {
    // 应用初始化逻辑
    console.log('App initialized')
  }

  componentDidShow() {
    // 应用进入前台时执行
  }

  componentDidHide() {
    // 应用进入后台时执行
  }

  render() {
    // this.props.children 是由Taro框架自动注入的页面组件
    return this.props.children
  }
}

export default App
