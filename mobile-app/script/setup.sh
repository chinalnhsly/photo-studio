#!/bin/bash

# 清理环境
rm -rf node_modules
rm -rf dist
rm -f yarn.lock

# 安装最基础的依赖
yarn add -D \
  webpack@5.88.2 \
  webpack-cli@5.1.4 \
  babel-loader@9.1.3 \
  @babel/core@7.23.9 \
  @babel/preset-typescript@7.23.3 \
  typescript@5.3.3 \
  --exact

# 创建基础配置
cat > babel.config.js << 'EOL'
module.exports = {
  presets: [
    '@babel/preset-typescript'
  ]
}
EOL

# 创建 tsconfig.json
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
EOL

# 强制重新构建
yarn install
yarn build:weapp

echo "基础环境配置完成！"
