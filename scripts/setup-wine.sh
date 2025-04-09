#!/bin/bash

# 确保脚本以root权限运行
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (use sudo)"
  exit 1
fi

# 添加32位架构支持
dpkg --add-architecture i386
apt update

# 安装 wine 和相关依赖
apt install -y \
  wine \
  wine32:i386 \
  wine64 \
  libwine \
  libwine:i386 \
  fonts-wine \
  cabextract \
  winetricks

# 安装中文字体支持
apt install -y \
  fonts-wqy-microhei \
  fonts-wqy-zenhei

# 切换到普通用户
NORMAL_USER=$SUDO_USER
if [ -z "$NORMAL_USER" ]; then
  echo "Error: Please run with sudo"
  exit 1
fi

# 配置wine环境
su - $NORMAL_USER << 'EOF'
# 删除已有的wine配置（如果存在）
rm -rf ~/.wine

# 初始化32位wine环境
WINEARCH=win32 WINEPREFIX=~/.wine wine wineboot

# 等待wine初始化完成
sleep 5

# 安装winetricks组件
WINEARCH=win32 WINEPREFIX=~/.wine winetricks -q msxml6 riched20 riched30
WINEARCH=win32 WINEPREFIX=~/.wine winetricks -q vcrun6 vcrun2008 vcrun2010

# 配置完成提示
echo "Wine 32位环境配置完成!"
EOF
