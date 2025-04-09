#!/bin/bash

# 创建页面目录结构
mkdir -p src/pages/{index,category,cart,user}/components
mkdir -p src/pages/index/components/ProductList

# 创建样式文件
touch src/pages/{index,category,cart,user}/index.scss

# 创建页面组件样式
cat > src/pages/index/components/ProductList/index.scss << 'EOL'
.product-list {
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 10px;
  }
}
EOL

# 给脚本执行权限
chmod +x create-pages.sh

# 更新app.config.ts
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
  }
})
EOL
