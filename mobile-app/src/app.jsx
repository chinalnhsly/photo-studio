import React, { Component } from 'react'
import './app.scss'
// 导入类型修复
import './fix-types'

class App extends Component {
  componentDidMount() {
    // 应用启动时应用类型修复
    console.log('App started with type fix applied')
  }

  render() {
    // this.props.children是由Taro框架注入的
    return this.props.children
  }
}

export default App
