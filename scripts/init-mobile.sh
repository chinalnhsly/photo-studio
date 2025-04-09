#!/bin/bash

# 确保在正确目录
cd /home/liyong/photostudio/mobile-app

# 清理现有文件
rm -rf *

# 创建package.json
cat > package.json << 'EOL'
{
  "name": "@photostudio/mobile-app",
  "version": "1.0.0",
  "private": true,
  "description": "影楼商城,订单预约,商品推荐,套系订单,客户看样片,物流收发",
  "templateInfo": {
    "name": "default",
    "typescript": true,
    "css": "none"
  },
  "scripts": {
    "dev:weapp": "taro build --type weapp --watch",
    "build:weapp": "taro build --type weapp",
    "dev:h5": "taro build --type h5 --watch",
    "build:h5": "taro build --type h5"
  }
}
EOL

# 在mobile-app目录中安装依赖
cd /home/liyong/photostudio
yarn workspace @photostudio/mobile-app add @tarojs/cli@4.0.9 --exact
yarn workspace @photostudio/mobile-app add @tarojs/runtime@4.0.9 @tarojs/taro@4.0.9 @tarojs/components@4.0.9 --exact
yarn workspace @photostudio/mobile-app add @tarojs/react@4.0.9 @tarojs/plugin-framework-react@4.0.9 --exact
yarn workspace @photostudio/mobile-app add react@18.0.0 react-dom@18.0.0 --exact

# 安装状态管理相关依赖
yarn workspace @photostudio/mobile-app add @reduxjs/toolkit@1.9.7 react-redux@8.1.3 --exact

# 安装开发依赖
yarn workspace @photostudio/mobile-app add -D sass@1.69.7 sass-loader@13.3.0 --exact

# 创建项目结构
cd /home/liyong/photostudio/mobile-app
mkdir -p src/{assets,components,pages/{home,product,order,user},services,store}

# 创建基础配置文件
cat > config/index.ts << 'EOL'
export default defineConfig({
  projectName: 'photostudio-mobile',
  date: '2024-2-20',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-framework-react'],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      }
    }
  }
})
EOL

# 创建基础入口文件
cat > src/app.tsx << 'EOL'
import { Component, PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import './app.scss'

class App extends Component<PropsWithChildren> {
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
EOL

# 创建store配置
cat > src/store/index.ts << 'EOL'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
EOL

# 安装所有依赖
yarn install
