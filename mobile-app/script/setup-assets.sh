#!/bin/bash

# 创建图标目录
mkdir -p src/assets/icons

# 定义图标URL数组
declare -A ICON_URLS=(
  ["home"]="https://raw.githubusercontent.com/ant-design/ant-design-icons/master/packages/icons-svg/svg/outlined/home.svg"
  ["category"]="https://raw.githubusercontent.com/ant-design/ant-design-icons/master/packages/icons-svg/svg/outlined/appstore.svg"
  ["cart"]="https://raw.githubusercontent.com/ant-design/ant-design-icons/master/packages/icons-svg/svg/outlined/shopping-cart.svg"
  ["user"]="https://raw.githubusercontent.com/ant-design/ant-design-icons/master/packages/icons-svg/svg/outlined/user.svg"
)

# 下载并转换图标
for icon in "${!ICON_URLS[@]}"; do
  # 普通图标
  curl -s "${ICON_URLS[$icon]}" | \
    sed 's/fill="currentColor"/fill="#999999"/' > \
    "src/assets/icons/${icon}.svg"
  
  # 激活状态图标
  curl -s "${ICON_URLS[$icon]}" | \
    sed 's/fill="currentColor"/fill="#333333"/' > \
    "src/assets/icons/${icon}-active.svg"
done

# 修改 app.config.ts 中的图标路径
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
        iconPath: 'assets/icons/home.svg',
        selectedIconPath: 'assets/icons/home-active.svg'
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
        iconPath: 'assets/icons/category.svg',
        selectedIconPath: 'assets/icons/category-active.svg'
      },
      {
        pagePath: 'pages/cart/index',
        text: '购物车',
        iconPath: 'assets/icons/cart.svg',
        selectedIconPath: 'assets/icons/cart-active.svg'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: 'assets/icons/user.svg',
        selectedIconPath: 'assets/icons/user-active.svg'
      }
    ]
  }
})
EOL

# 给脚本执行权限
chmod +x setup-assets.sh

# 重新构建
yarn build:weapp
