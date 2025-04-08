mkdir -p photostudio/{mobile-app,web-app,admin-mobile,admin-web,server}/src
cd photostudio

# 初始化git
git init
echo "node_modules/\n.env\ndist/\n.DS_Store" > .gitignore
