#!/bin/bash

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

echo "===== 全面修复构建问题 ====="

# 1. 清理环境
echo "1. 清理项目环境..."
rm -rf node_modules dist .taro-cache yarn.lock package-lock.json
mkdir -p src/polyfills

# 2. 创建Node.js核心模块polyfill
echo "2. 创建Node.js核心模块polyfill..."
cat > src/polyfills/node-polyfills.js << 'EOL'
// Node.js 核心模块 polyfills
if (typeof window !== 'undefined') {
  // 为浏览器环境提供空的Node模块
  window.process = window.process || { env: { NODE_ENV: 'production' } };
  window.Buffer = window.Buffer || { isBuffer: () => false };
  window.setImmediate = window.setImmediate || ((fn) => setTimeout(fn, 0));
  
  // 模拟Node.js模块
  window.module = window.module || {};
  window.module.exports = window.module.exports || {};
  
  // 核心模块
  window.fs = window.fs || { existsSync: () => false };
  window.path = window.path || { 
    join: () => '', 
    resolve: () => '',
    dirname: () => '',
    extname: () => '',
    basename: () => '' 
  };
  window.os = window.os || { platform: () => 'browser' };
  window.child_process = window.child_process || {};
  window.url = window.url || {};
  window.worker_threads = window.worker_threads || {};
  window.inspector = window.inspector || {};
  window.pnpapi = window.pnpapi || {};
}
EOL

# 3. 创建webpack配置文件
echo "3. 创建webpack配置..."
cat > config/webpack.config.js << 'EOL'
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

// 获取Node.js核心模块列表
const nodeModules = [
  'child_process', 'fs', 'path', 'url', 'util', 'os', 
  'crypto', 'stream', 'buffer', 'worker_threads', 'inspector',
  'pnpapi'
];

// 创建空模块
const createEmptyModule = path.resolve(__dirname, '../src/polyfills/empty.js');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: nodeModules.reduce((acc, mod) => {
      acc[mod] = false; // 禁用所有Node核心模块
      return acc;
    }, {}),
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    // 提供Node.js核心模块polyfill
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: process.env.NODE_ENV === 'production',
          },
        },
        extractComments: false,
      }),
    ],
  }
};
EOL

# 4. 创建babel配置
echo "4. 创建Babel配置..."
cat > babel.config.js << 'EOL'
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { browsers: ['last 2 versions', 'safari >= 7'] },
      useBuiltIns: 'usage',
      corejs: 3
    }],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ]
}
EOL

# 5. 更新package.json
echo "5. 更新package.json..."
cat > package.json << 'EOL'
{
  "name": "@photostudio/mobile-app",
  "version": "1.0.0",
  "private": true,
  "description": "摄影工作室小程序",
  "templateInfo": {
    "name": "default",
    "typescript": true,
    "css": "scss"
  },
  "scripts": {
    "dev:weapp": "taro build --type weapp --watch",
    "build:weapp": "taro build --type weapp",
    "dev:h5": "taro build --type h5 --watch",
    "build:h5": "taro build --type h5"
  },
  "dependencies": {
    "@babel/runtime": "7.23.9",
    "@tarojs/components": "4.0.9",
    "@tarojs/helper": "4.0.9",
    "@tarojs/plugin-framework-react": "4.0.9",
    "@tarojs/plugin-platform-weapp": "4.0.9",
    "@tarojs/react": "4.0.9",
    "@tarojs/runtime": "4.0.9",
    "@tarojs/shared": "4.0.9",
    "@tarojs/taro": "4.0.9",
    "buffer": "6.0.3",
    "process": "0.11.10",
    "path-browserify": "1.0.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "stream-browserify": "3.0.0"
  },
  "devDependencies": {
    "@babel/core": "7.23.9",
    "@babel/plugin-proposal-class-properties": "7.18.6",
    "@babel/plugin-proposal-object-rest-spread": "7.20.7",
    "@babel/plugin-transform-runtime": "7.23.9",
    "@babel/preset-env": "7.23.9",
    "@babel/preset-react": "7.23.3",
    "@babel/preset-typescript": "7.23.3",
    "@tarojs/cli": "4.0.9",
    "@tarojs/mini-runner": "4.0.9",
    "@tarojs/service": "4.0.9",
    "@types/react": "18.2.0",
    "@types/webpack-env": "1.18.4",
    "babel-loader": "9.1.3",
    "babel-plugin-import": "1.13.5",
    "babel-preset-taro": "4.0.9",
    "core-js": "3.36.1",
    "css-loader": "6.10.0",
    "postcss": "8.4.18",
    "sass": "1.69.7",
    "sass-loader": "13.3.3",
    "style-loader": "3.3.4",
    "terser-webpack-plugin": "5.3.10",
    "typescript": "5.3.3",
    "webpack": "5.88.2",
    "webpack-cli": "5.1.4",
    "webpack-dev-server": "4.15.1"
  }
}
EOL

# 6. 修改入口文件
echo "6. 确保入口文件正确加载polyfills..."
cat > src/app.js << 'EOL'
import './polyfills/node-polyfills';
import { createElement } from 'react';
import { createApp } from '@tarojs/taro';

// 使用函数组件
function App({ children }) {
  return children;
}

// 创建小程序应用
const app = createApp({ 
  onLaunch() {
    console.log('App launched');
  }
});

app.render(createElement(App));

export default {
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/cart/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '影楼商城',
    navigationBarTextStyle: 'black'
  }
};
EOL

# 7. 安装依赖
echo "7. 安装依赖..."
yarn install --force

# 8. 清理缓存和重新构建
echo "8. 清理缓存并构建..."
rm -rf .taro-cache dist
NODE_ENV=development yarn build:weapp

echo ""
echo "===== 构建修复完成 ====="
echo "请检查dist目录，然后使用微信开发者工具打开预览"
