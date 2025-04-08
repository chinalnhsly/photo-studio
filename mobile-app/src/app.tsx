import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './store/reducers'

import './app.scss'

type AppProps = {
  children?: React.ReactNode
}

// 创建 store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

class App extends Component<AppProps> {
  // 小程序配置
  static config = {
    pages: [
      'pages/index/index',
      'pages/category/index',
      'pages/cart/index',
      'pages/user/index',
      'pages/product/detail'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '摄影工作室',
      navigationBarTextStyle: 'black'
    }
  }

  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
