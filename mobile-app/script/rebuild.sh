#!/bin/bash

# 清理旧的构建文件
rm -rf dist
rm -rf .taro-cache
rm -f yarn.lock

# 安装webpack相关依赖
yarn add -D webpack@5.91.0 \
  webpack-cli@5.1.4 \
  webpack-dev-server@4.15.1 \
  babel-loader@9.1.3 \
  style-loader@3.3.4 \
  css-loader@6.10.0 \
  sass-loader@13.3.0 \
  --exact

# 更新项目配置
cat > project.config.json << 'EOL'
{
  "miniprogramRoot": "dist/",
  "projectname": "photostudio-mobile",
  "description": "影楼商城小程序",
  "appid": "touristappid",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": true,
    "coverView": true,
    "nodeModules": true,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": false,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    }
  },
  "compileType": "miniprogram",
  "libVersion": "2.25.3",
  "srcMiniprogramRoot": "dist/",
  "packOptions": {
    "ignore": [],
    "include": []
  },
  "condition": {}
}
EOL

# 重新安装所有依赖
yarn install

# 重新构建
yarn build:weapp

echo "构建完成！请在微信开发者工具中重新导入项目"
