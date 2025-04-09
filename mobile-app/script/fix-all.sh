#!/bin/bash

# 清理环境
rm -rf node_modules
rm -rf dist
rm -rf .taro-cache
rm -f yarn.lock
rm -f package-lock.json

# 创建图标目录
mkdir -p src/assets/icons

# 下载基础图标
BASE_URL="https://raw.githubusercontent.com/feathericons/feather/master/icons"
ICONS=(
  "home:home"
  "category:grid"
  "cart:shopping-cart"
  "user:user"
)

for pair in "${ICONS[@]}"; do
  IFS=':' read -r name icon <<< "$pair"
  
  # 下载并转换普通图标
  curl -s "$BASE_URL/$icon.svg" | \
    sed 's/stroke="currentColor"/stroke="#999999"/' > \
    "src/assets/icons/$name.png"
  
  # 下载并转换激活状态图标
  curl -s "$BASE_URL/$icon.svg" | \
    sed 's/stroke="currentColor"/stroke="#333333"/' > \
    "src/assets/icons/$name-active.png"
done

# 更新 app.config.ts
cat > src/app.config.ts << 'EOL'
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/cart/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '摄影工作室',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#333',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: '/assets/icons/home.png',
        selectedIconPath: '/assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
        iconPath: '/assets/icons/category.png',
        selectedIconPath: '/assets/icons/category-active.png'
      },
      {
        pagePath: 'pages/cart/index',
        text: '购物车',
        iconPath: '/assets/icons/cart.png',
        selectedIconPath: '/assets/icons/cart-active.png'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: '/assets/icons/user.png',
        selectedIconPath: '/assets/icons/user-active.png'
      }
    ]
  }
})
EOL

# 安装核心依赖
yarn add @tarojs/cli@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/taro@4.0.9 \
  @tarojs/components@4.0.9 \
  @tarojs/react@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
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
  --exact

# 创建 babel.config.js
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
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: false
    }]
  ]
}
EOL

# 安装所有依赖
yarn install

# 重新构建
yarn build:weapp

# 提示下一步操作
echo "修复完成！请在微信开发者工具中："
echo "1. 删除项目"
echo "2. 重新导入项目(选择 dist 目录)"
echo "3. 点击'工具' -> '构建 npm'"
echo "4. 点击'编译'"
