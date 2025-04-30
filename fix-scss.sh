#!/bin/bash

cd /home/liyong/photostudio/admin-web

# 修改引入路径
sed -i 's/index\.scss/index\.less/g' src/components/TagSelect/index.tsx
sed -i 's/BookingList\.scss/BookingList\.less/g' src/pages/booking/BookingList.tsx 
sed -i 's/CustomerList\.scss/CustomerList\.less/g' src/pages/customer/CustomerList.tsx
sed -i 's/style\.scss/style\.less/g' src/pages/dashboard/index.tsx

# 删除可能存在的 .scss 文件，以避免混淆
find src -name "*.scss" -delete

echo "SCSS 引用已修复为 LESS"

# 清理缓存
rm -rf src/.umi
rm -rf src/.umi-production

echo "Umi 缓存已清理"

# 重新启动
echo "现在可以重新启动项目了"
