export default {
  pages: [
    'pages/home/index',
    'pages/product/detail/index',
    'pages/category/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '影楼商城',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#999999",
    selectedColor: "#ff6b81",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/home/index",
        text: "首页",
        iconPath: "./assets/icons/home.png",
        selectedIconPath: "./assets/icons/home-active.png"
      },
      {
        pagePath: "pages/category/index",
        text: "分类",
        iconPath: "./assets/icons/category.png",
        selectedIconPath: "./assets/icons/category-active.png"
      },
      {
        pagePath: "pages/user/index",
        text: "我的",
        iconPath: "./assets/icons/user.png",
        selectedIconPath: "./assets/icons/user-active.png"
      }
    ]
  }
}
