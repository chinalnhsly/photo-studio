#!/bin/bash

echo "=== 开始深度修复 Taro 项目问题 ==="

cd /home/liyong/photostudio/mobile-app

# 确保目录结构完整
mkdir -p src/pages/category

# 备份当前代码
BACKUP_DIR="/home/liyong/photostudio/backups/taro-backup-$(date +%Y%m%d-%H%M%S)"
echo "创建备份在: $BACKUP_DIR"
mkdir -p $BACKUP_DIR
cp -r . $BACKUP_DIR

echo "清理项目..."
rm -rf .temp
rm -rf .cache
rm -rf dist
rm -rf node_modules
rm yarn.lock

# 检查并修复依赖
echo "更新 package.json..."
cat > fix-package-versions.js << 'EOF'
const fs = require('fs');
const pkg = require('./package.json');

// 设定关键依赖的兼容版本
const fixedVersions = {
  "@tarojs/cli": "^4.0.9",
  "@tarojs/components": "4.0.9",
  "@tarojs/plugin-framework-react": "4.0.9",
  "@tarojs/react": "4.0.9",
  "@tarojs/runtime": "4.0.9",
  "@tarojs/webpack5-runner": "4.0.9",
  "@tarojs/plugin-platform-weapp": "4.0.9",
  "@tarojs/taro": "4.0.9",
};

// 更新依赖版本
Object.keys(fixedVersions).forEach(dep => {
  if (pkg.dependencies && pkg.dependencies[dep]) {
    pkg.dependencies[dep] = fixedVersions[dep];
  }
  if (pkg.devDependencies && pkg.devDependencies[dep]) {
    pkg.devDependencies[dep] = fixedVersions[dep];
  }
});

// 添加缺失的scripts
pkg.scripts = pkg.scripts || {};
pkg.scripts["build:weapp"] = "taro build --type weapp";
pkg.scripts["dev:weapp"] = "taro build --type weapp --watch";

fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
console.log('package.json 已更新');
EOF

node fix-package-versions.js
rm fix-package-versions.js

echo "重新安装依赖..."
yarn install

echo "创建或修复 SCSS 全局变量文件..."
mkdir -p src/styles
cat > src/styles/variables.scss << 'EOF'
/* 全局颜色变量 */
:root {
  --primary-color: #ff6b81;
  --text-color: #333333;
  --light-text: #999999;
  --background-color: #f8f9fa;
  --white: #ffffff;
  --shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
EOF

echo "检查并修复 Taro 配置文件..."
mkdir -p config
cat > config/index.js << 'EOF'
const path = require('path');

const config = {
  projectName: 'mobile-app',
  date: '2023-6-15',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
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
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/styles': path.resolve(__dirname, '..', 'src/styles'),
    '@/services': path.resolve(__dirname, '..', 'src/services'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils')
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
EOF

cat > config/dev.js << 'EOF'
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {}
}
EOF

cat > config/prod.js << 'EOF'
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {
    optimizeMainPackage: {
      enable: true
    },
    webpackChain(chain) {
      chain.mode('production')
    }
  },
  h5: {
    webpackChain(chain) {
      chain.mode('production')
    }
  }
}
EOF

echo "添加全局错误处理..."
cat > src/app.js << 'EOF'
import React, { Component } from 'react';
import './app.scss';

class App extends Component {
  componentDidMount() {
    // 全局错误处理
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', event => {
        console.error('未捕获的Promise拒绝:', event.reason);
        event.preventDefault(); // 防止默认处理
      });
    }
    
    // Node环境的未捕获Promise拒绝处理
    if (typeof process !== 'undefined') {
      process.on('unhandledRejection', (reason, promise) => {
        console.error('未捕获的Promise拒绝:', promise, '原因:', reason);
      });
    }
  }

  // 可以使用所有的 React 生命周期方法
  componentDidShow() {}
  componentDidHide() {}

  // 对应 onError
  onError(err) {
    console.error('应用错误:', err);
  }

  // 在入口组件不会渲染任何内容，完全是管理应用的
  render() {
    // this.props.children 是将要会渲染的页面
    return this.props.children;
  }
}

export default App;
EOF

echo "修复完成，现在尝试编译项目:"
echo "cd /home/liyong/photostudio/mobile-app && yarn build:weapp --watch"
