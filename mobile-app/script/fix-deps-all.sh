#!/bin/bash

# 清理环境
rm -rf node_modules
rm -f yarn.lock
rm -f package-lock.json
rm -rf .taro-cache
rm -rf dist

# 删除可能冲突的依赖
rm -rf node_modules/@babel
rm -rf node_modules/@types

# 安装核心依赖
yarn add @tarojs/cli@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/taro@4.0.9 \
  @tarojs/components@4.0.9 \
  @tarojs/react@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
  @tarojs/webpack5-runner@4.0.9 \
  react@18.2.0 \
  react-dom@18.2.0 \
  --exact

# 安装开发依赖
yarn add -D @babel/core@7.22.0 \
  @babel/preset-env@7.22.0 \
  @babel/preset-react@7.22.0 \
  @babel/preset-typescript@7.22.0 \
  @babel/runtime@7.22.0 \
  @babel/plugin-transform-runtime@7.22.0 \
  typescript@4.9.5 \
  @types/node@18.0.0 \
  @types/react@18.2.0 \
  @types/react-dom@18.2.0 \
  @types/webpack-env@1.18.4 \
  postcss@8.4.35 \
  less@4.2.0 \
  stylus@0.62.0 \
  sass@1.69.7 \
  sass-loader@13.3.0 \
  --exact

# 创建 tsconfig.json
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": [
      "node",
      "webpack-env",
      "react",
      "react-dom"
    ]
  },
  "include": [
    "src",
    "types"
  ]
}
EOL

# 创建 babel.config.js
cat > babel.config.js << 'EOL'
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { 
      regenerator: true,
      helpers: true,
      corejs: false
    }]
  ]
}
EOL

# 更新配置文件
cat > config/index.js << 'EOL'
const config = {
  projectName: 'photostudio-mobile',
  date: '2024-3-13',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-framework-react',
    '@tarojs/plugin-platform-weapp'
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false
    }
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
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
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
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
EOL

# 重新安装并检查
yarn install
yarn tsc --noEmit

echo "所有依赖已修复完成！"
