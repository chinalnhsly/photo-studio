# Linux 安装微信开发者工具指南

## 一、使用 wine 安装（推荐方式）

### 1. 安装 wine 和依赖

```bash
# 安装 wine
sudo apt update
sudo apt install wine64 wine32

# 安装必要依赖
sudo apt install \
  cabextract \
  zenity \
  xdg-utils \
  winbind \
  winetricks
```

### 2. 配置 wine 环境

```bash
# 创建 32 位 wine 容器
WINEARCH=win32 WINEPREFIX=~/.wine wine wineboot

# 安装必要组件
winetricks -q msxml6 riched20 riched30 ie6 vcrun6 vcrun2008 vcrun2010 vcrun2012 vcrun2013 vcrun2015

# 安装中文字体支持
winetricks corefonts wenquanyi
```

### 3. 下载并安装微信开发者工具

```bash
# 创建下载目录
mkdir -p ~/Downloads/wechat-devtools
cd ~/Downloads/wechat-devtools

# 下载最新稳定版本
wget https://servicewechat.com/wxa-dev-logic/download_redirect?type=x64&from=mpwiki&download_version=stable

# 使用 wine 安装
wine wechatdevtools-1.06.2307250-x64.exe
```

## 二、使用官方 Linux 版本（beta）

### 1. 下载 Linux 版本

访问官方下载页面：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
选择 Linux 版本下载

### 2. 安装步骤

```bash
# 解压下载的文件
cd ~/Downloads
tar -xvf wechat-devtools-linux-*.tar.gz

# 移动到应用目录
sudo mv wechat-devtools /opt/

# 创建桌面快捷方式
cat > ~/.local/share/applications/wechat-devtools.desktop << 'EOL'
[Desktop Entry]
Name=微信开发者工具
Comment=微信开发者工具
Exec=/opt/wechat-devtools/bin/wechat-devtools
Icon=/opt/wechat-devtools/resources/app/icon.png
Type=Application
Categories=Development;
EOL
```

## 三、常见问题解决

1. 如果遇到字体显示问题：
```bash
# 安装文泉驿字体
sudo apt install fonts-wqy-microhei fonts-wqy-zenhei
```

2. 如果遇到权限问题：
```bash
# 修改目录权限
sudo chown -R $USER:$USER /opt/wechat-devtools
chmod +x /opt/wechat-devtools/bin/*
```

3. 如果遇到网络问题：
```bash
# 配置 wine 的网络代理
WINEPREFIX=~/.wine wine regedit
# 在注册表编辑器中添加以下键值
# HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings
# "ProxyEnable"=dword:00000001
# "ProxyServer"="127.0.0.1:7890"
```

## 四、额外配置建议

1. 创建启动脚本：

```bash
# 创建启动脚本
cat > ~/bin/wechat-devtools << 'EOL'
#!/bin/bash
export WINEPREFIX=~/.wine
export WINEARCH=win32
wine ~/.wine/drive_c/Program\ Files/Tencent/微信开发者工具/wechatdevtools.exe
EOL

chmod +x ~/bin/wechat-devtools
```

2. 设置开发环境变量：

```bash
# 添加到 ~/.bashrc
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## 五、注意事项

1. Wine 版本要求：
   - 建议使用 wine-6.0 或更高版本
   - 可以通过 `wine --version` 查看版本

2. 系统要求：
   - 建议至少 8GB 内存
   - 至少 10GB 可用磁盘空间

3. 性能优化：
   - 可以通过 dxvk 改善图形性能
   - 使用 SSD 可以显著提升启动速度

4. 调试技巧：
```bash
# 查看 wine 调试信息
WINEDEBUG=+all wine wechatdevtools.exe
```
