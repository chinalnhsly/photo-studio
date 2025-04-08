#!/bin/bash

# 更新根目录的package.json
echo '{
  "name": "photostudio",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "workspaces": [
    "mobile-app",
    "server"
  ]
}' > package.json

# 更新mobile-app的package.json
cd mobile-app
TEMP_FILE=$(mktemp)
jq '. + {"license": "MIT"}' package.json > "$TEMP_FILE" && mv "$TEMP_FILE" package.json

# 清理并重新安装
yarn cache clean
yarn install --force
