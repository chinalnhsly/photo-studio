#!/bin/bash

# 设置代理（如果有）
# export http_proxy="http://127.0.0.1:7890"
# export https_proxy="http://127.0.0.1:7890"

# 设置 winetricks 镜像
export WINETRICKS_DOWNLOADER="aria2c"
export WINETRICKS_CACHE_DIR="$HOME/.cache/winetricks"

# 安装必要工具
sudo apt update
sudo apt install -y \
    aria2 \
    cabextract \
    winbind \
    xdg-utils \
    zenity

# 添加 32 位架构支持
sudo dpkg --add-architecture i386
sudo apt update

# 安装 Wine
sudo apt install -y \
    wine \
    wine32:i386 \
    wine64 \
    fonts-wqy-microhei \
    fonts-wqy-zenhei

# 创建干净的 Wine 环境
rm -rf ~/.wine
WINEARCH=win32 WINEPREFIX=~/.wine wineboot -u

# 下载 winetricks 最新版本
wget -O /tmp/winetricks https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks
sudo mv /tmp/winetricks /usr/local/bin/
sudo chmod +x /usr/local/bin/winetricks

# 使用国内镜像下载必要组件
cat > /tmp/winetricks.conf << 'EOL'
WINE_SITE="https://mirrors.tuna.tsinghua.edu.cn/wine/wine/wine-4.0"
W_DOWNLOAD_MIRROR="https://mirrors.ustc.edu.cn"
EOL

sudo mv /tmp/winetricks.conf /etc/winetricks.conf

# 安装基础组件
WINEARCH=win32 WINEPREFIX=~/.wine winetricks -q \
    corefonts \
    d3dx9 \
    riched20 \
    riched30 \
    msxml6 \
    vcrun6

# 配置 Wine
cat > ~/.wine/user.reg << 'EOL'
[Software\\Wine\\DllOverrides]
"*mscoree"=""
"*mshtml"=""
"*winemenubuilder.exe"=""
EOL

# 创建启动脚本
mkdir -p ~/bin
cat > ~/bin/wechat-devtools << 'EOL'
#!/bin/bash
export WINEARCH=win32
export WINEPREFIX=~/.wine
# 启用 High DPI 支持
export WINEDLLOVERRIDES="winemenubuilder.exe=d"
export DISPLAY=:0.0
cd ~/.wine/drive_c/Program\ Files/Tencent/微信开发者工具/
wine wechatdevtools.exe
EOL

chmod +x ~/bin/wechat-devtools

echo "基础环境配置完成！"
echo "接下来您可以下载并安装微信开发者工具..."
