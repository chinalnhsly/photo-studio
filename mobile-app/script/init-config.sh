#!/bin/bash

# 创建配置目录
mkdir -p config

# 创建开发环境配置
cat > config/dev.js << 'EOL'
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    devServer: {
      port: 3000
    }
  }
}
EOL

# 创建生产环境配置
cat > config/prod.js << 'EOL'
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {}
}
EOL

# 给予执行权限
chmod +x init-config.sh

# 重新构建项目
yarn build:weapp
