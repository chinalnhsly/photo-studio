import { PropsWithChildren } from 'react'
import { createReactApp } from '@tarojs/plugin-framework-react'
import './app.scss'

// 定义 App 组件
function App({ children }: PropsWithChildren<any>) {
  return children
}

// 使用 createReactApp 初始化应用
const app = createReactApp({
  component: App,
  onLaunch() {
    console.log('App launched.')
  }
})

// 导出配置
export default {
  // ...existing code...
}

// 导出应用实例
export { app }

