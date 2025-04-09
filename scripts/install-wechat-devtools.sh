#!/bin/bash

# 设置下载目录
DOWNLOAD_DIR="$HOME/Downloads/wechat-devtools"
mkdir -p "$DOWNLOAD_DIR"
cd "$DOWNLOAD_DIR"

# 使用 curl 下载（带进度条和断点续传）
echo "开始下载微信开发者工具..."
curl -L -C - "https://dldir1.qq.com/WechatWebDev/release/p-ae42ee2cde4d42ee80ac60b35f183a99/wechat_devtools_1.06.2307250_x64.exe" \
  -o wechat_devtools_x64.exe

# 检查下载是否成功
if [ ! -f wechat_devtools_x64.exe ]; then
    echo "下载失败，尝试备用下载方式..."
    # 备用下载链接
    curl -L -C - "https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html" \
      -o wechat_devtools_x64.exe
fi

# 安装依赖
echo "安装必要依赖..."
sudo apt update
sudo apt install -y \
    wine64 \
    wine32 \
    winetricks \
    cabextract

# 配置 Wine
echo "配置 Wine 环境..."
WINEARCH=win32 WINEPREFIX=~/.wine wine wineboot
winetricks -q msxml6 riched20 riched30 ie6

# 安装开发者工具
echo "开始安装微信开发者工具..."
cd "$DOWNLOAD_DIR"
WINEARCH=win32 WINEPREFIX=~/.wine wine wechat_devtools_x64.exe

# 创建桌面快捷方式
echo "创建桌面快捷方式..."
cat > ~/.local/share/applications/wechat-devtools.desktop << EOL
[Desktop Entry]
Name=微信开发者工具
Comment=微信小程序开发工具
Exec=env WINEPREFIX=~/.wine wine "C:\\Program Files\\Tencent\\微信开发者工具\\wechatdevtools.exe"
Icon=wechat-devtools
Type=Application
Categories=Development;
EOL

echo "安装完成！"
echo "你可以在应用程序菜单中找到'微信开发者工具'启动项"
