#!/bin/bash
cd mobile-app

# 移除过时和不安全的包
yarn remove stylus webpack-chain @swc/register vm2 lodash.isequal acorn-import-assertions @humanwhocodes/config-array @humanwhocodes/object-schema css-parse

# 安装新版本的依赖
yarn add sass@1.69.7 --dev
yarn add @swc-node/register@1.6.8 --dev
yarn add isolated-vm@5.0.0
yarn add @eslint/config-array@0.20.0
yarn add @eslint/object-schema@2.1.6
yarn add rimraf@5.0.0
yarn add glob@10.3.10

# 更新Babel插件
yarn remove @babel/plugin-proposal-class-properties
yarn add @babel/plugin-transform-class-properties@7.23.3 --dev

# 更新ESLint
yarn add eslint@8.57.0 --dev
yarn add @typescript-eslint/eslint-plugin@6.21.0 --dev
yarn add @typescript-eslint/parser@6.21.0 --dev

# 更新package.json中的scripts
cat > package.json << 'EOL'
{
  // ...existing code...
  "resolutions": {
    "glob": "^10.3.10",
    "rimraf": "^5.0.0",
    "memfs": "^4.6.0",
    "acorn-import-attributes": "^1.9.5"
  }
  // ...existing code...
}
EOL

# 清理并重新安装
yarn cache clean
yarn install --force
