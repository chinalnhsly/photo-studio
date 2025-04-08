#!/bin/bash

# 提交所有更改
git add .
git commit -m "feat: 更新影楼商城代码 [v1.1.7]"

# 创建新标签
git tag v1.1.7

# 推送到远程仓库
git push origin main --force-with-lease
git push origin --tags --force

# 验证推送结果
git status
git log --oneline --decorate
