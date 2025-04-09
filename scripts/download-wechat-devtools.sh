#!/bin/bash

# 创建下载目录
DOWNLOAD_DIR="$HOME/Downloads/wechat-devtools"
mkdir -p "$DOWNLOAD_DIR"
cd "$DOWNLOAD_DIR"

echo "开始下载微信开发者工具..."

# 使用多个备用下载地址
URLS=(
    "https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html"
    "https://servicewechat.com/wxa-dev-logic/download_redirect?type=ia32&from=mpwiki&download_version=1062412050&platform=win"
    "https://servicewechat.com/wxa-dev-logic/download_redirect?type=win32&download_version=stable"
)

download_success=false

for url in "${URLS[@]}"; do
    echo "尝试从 $url 下载..."
    
    # 使用 wget 替代 aria2c（更好的重定向支持）
    wget --no-check-certificate \
         --content-disposition \
         --tries=3 \
         --timeout=30 \
         --no-verbose \
         "$url" -O wechat_devtools_win32.exe

    if [ $? -eq 0 ] && [ -s wechat_devtools_win32.exe ]; then
        download_success=true
        break
    else
        echo "从 $url 下载失败，尝试下一个地址..."
        rm -f wechat_devtools_win32.exe
    fi
done

if [ "$download_success" = false ]; then
    echo "所有下载地址均失败。建议："
    echo "1. 访问 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
    echo "2. 手动下载 Windows 32位版本"
    echo "3. 将下载文件复制到: $DOWNLOAD_DIR/wechat_devtools_win32.exe"
    exit 1
fi

echo "下载完成，准备安装..."

# 确保 Wine 环境正确
if ! command -v wine &> /dev/null; then
    echo "Wine 未安装，请先安装 Wine..."
    exit 1
fi

# 使用 Wine 安装
echo "开始安装..."
WINEARCH=win32 WINEPREFIX=~/.wine wine wechat_devtools_win32.exe

echo "安装向导已启动，请按提示完成安装"
