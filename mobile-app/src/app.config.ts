export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/cart/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '摄影工作室',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#333',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: '/assets/icons/home.png',
        selectedIconPath: '/assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
        iconPath: '/assets/icons/category.png',
        selectedIconPath: '/assets/icons/category-active.png'
      },
      {
        pagePath: 'pages/cart/index',
        text: '购物车',
        iconPath: '/assets/icons/cart.png',
        selectedIconPath: '/assets/icons/cart-active.png'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: '/assets/icons/user.png',
        selectedIconPath: '/assets/icons/user-active.png'
      }
    ]
  }
})
