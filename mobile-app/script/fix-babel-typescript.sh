#!/bin/bash

# 清理环境
rm -rf node_modules
rm -f yarn.lock
rm -rf .taro-cache

# 安装 Babel 相关依赖（使用新版本）
yarn add -D @babel/core@^7.20.0 \
  @babel/preset-env@^7.20.0 \
  @babel/preset-react@^7.20.0 \
  @babel/preset-typescript@^7.20.0 \
  @babel/runtime@^7.20.0 \
  babel-plugin-transform-runtime@^7.20.0 \
  --exact

# 安装 Taro 相关依赖
yarn add @tarojs/cli@4.0.9 \
  @tarojs/components@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
  @tarojs/react@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/taro@4.0.9 \
  --exact

# 安装 React 相关依赖
yarn add react@18.2.0 \
  react-dom@18.2.0 \
  --exact

# 安装 TypeScript 相关依赖
yarn add -D typescript@4.9.5 \
  @types/node@18.0.0 \
  @types/react@18.2.0 \
  @types/react-dom@18.2.0 \
  @types/webpack-env@1.18.4 \
  --exact

# 创建 babel 配置
cat > babel.config.js << 'EOL'
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { 
      regenerator: true 
    }]
  ]
}
EOL

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
      "@types/jest",
      "@tarojs/taro"
    ]
  },
  "include": [
    "src",
    "types"
  ]
}
EOL

# 安装所有依赖
yarn install

# 验证配置
echo "验证 Babel 配置..."
yarn tsc --noEmit

echo "配置修复完成！"
