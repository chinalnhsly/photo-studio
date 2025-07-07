# Debian Linux 安装微信开发者工具指南

## 一、安装 Wine

```bash
# 1. 添加 32 位架构支持
sudo dpkg --add-architecture i386

# 2. 更新软件源
sudo apt update

# 3. 安装 Wine 及依赖
sudo apt install -y wine wine32 wine64 \
  libwine libwine:i386 fonts-wine \
  winetricks

# 4. 验证安装
wine --version
```

## 二、下载并安装微信开发者工具

```bash
# 1. 创建工作目录
mkdir -p ~/wechat-devtools
cd ~/wechat-devtools

# 2. 下载开发者工具（根据需要选择版本）
wget https://servicewechat.com/wxa-dev-tools/release/stable/linux-x64

# 3. 解压文件
tar -xvf linux-x64

# 4. 创建启动脚本
cat > ~/wechat-devtools/launch.sh << 'EOL'
#!/bin/bash
cd ~/wechat-devtools
APPDATA="$HOME/.wine/drive_c/users/$USER/AppData/Local/微信开发者工具"
WECHAT_DEVTOOLS="$HOME/wechat-devtools"
wine "$WECHAT_DEVTOOLS/微信开发者工具.exe"
EOL

# 5. 添加执行权限
chmod +x ~/wechat-devtools/launch.sh
```

## 三、配置 Wine 环境

```bash
# 1. 初始化 Wine 配置
WINEARCH=win64 WINEPREFIX=~/.wine winecfg

# 2. 安装必要组件
winetricks -q msxml6 riched20 riched30 corefonts
```

## 四、创建桌面快捷方式

```bash
# 创建桌面启动器
cat > ~/.local/share/applications/wechat-devtools.desktop << 'EOL'
[Desktop Entry]
Name=微信开发者工具
Comment=微信小程序开发工具
Exec=/home/$USER/wechat-devtools/launch.sh
Icon=/home/$USER/wechat-devtools/icon.png
Terminal=false
Type=Application
Categories=Development;
EOL
```

## 五、常见问题解决

1. **字体显示异常**
```bash
# 安装中文字体
sudo apt install -y fonts-wqy-microhei fonts-wqy-zenhei
```

2. **运行崩溃**
```bash
# 重置 Wine 配置
WINEARCH=win64 WINEPREFIX=~/.wine wineboot -u
```

3. **提示缺少依赖**
```bash
# 安装额外依赖
sudo apt install -y \
  libgconf-2-4 \
  libatomic1 \
  libgtk-3-0 \
  libnss3 \
  libxss1
```

## 六、优化配置

1. **提升性能**
```bash
# 添加到 ~/.bashrc
export WINEDEBUG=-all
export