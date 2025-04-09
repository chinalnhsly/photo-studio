#!/bin/bash

# 清理环境
rm -rf node_modules dist
rm -f yarn.lock package-lock.json

# 安装最小必要依赖
yarn add -D \
  webpack@5.88.0 \
  webpack-cli@5.1.4 \
  babel-loader@9.1.3 \
  @babel/core@7.23.9 \
  @babel/preset-env@7.23.9 \
  @babel/preset-typescript@7.23.3 \
  --exact

# 更新 tsconfig.json
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["dom", "es2015"],
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
EOL

# 重新构建
rm -rf dist
yarn build:weapp

echo "使用简化配置重新构建完成！"
