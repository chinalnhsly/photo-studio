#!/bin/bash

# 清理旧的依赖
rm -rf node_modules/@babel
rm -f package-lock.json
rm -f yarn.lock

# 删除 dist 和缓存
rm -rf dist
rm -rf .taro-cache

# 安装指定版本的 babel 相关依赖
yarn add @babel/runtime@7.22.0 \
  @babel/core@7.22.0 \
  @babel/preset-env@7.22.0 \
  @babel/preset-react@7.22.0 \
  @babel/preset-typescript@7.22.0 \
  @babel/plugin-transform-runtime@7.22.0 \
  --exact

# 创建 babel 配置
cat > babel.config.js << 'EOL'
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        ios: '9',
        android: '4.4'
      }
    }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
      helpers: true,
      regenerator: true
    }]
  ]
}
EOL

# 更新 package.json 的 babel 配置
cat > .babelrc << 'EOL'
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "corejs": 3,
      "helpers": true,
      "regenerator": true,
      "useESModules": false
    }]
  ]
}
EOL

# 清理并重新安装所有依赖
yarn install

# 重新构建
yarn build:weapp

echo "Babel Runtime 修复完成，请在微信开发者工具中重新构建项目"
