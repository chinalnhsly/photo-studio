#!/bin/bash

# 安装测试相关依赖
yarn add -D @types/jest@^29.5.12 jest@^29.7.0 ts-jest@^29.1.2 --exact

# 创建Jest配置
cat > jest.config.js << 'EOL'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  }
}
EOL

# 清理缓存
rm -rf node_modules/.cache/typescript
rm -rf node_modules/.cache/jest

# 重新构建
yarn dev:weapp
