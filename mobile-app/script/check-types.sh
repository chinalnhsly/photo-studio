#!/bin/bash

# 验证类型定义是否正确安装
tsc --noEmit

# 如果类型检查失败，重新安装类型定义
if [ $? -ne 0 ]; then
  echo "Type checking failed, reinstalling type definitions..."
  ./setup-types-fix.sh
fi
