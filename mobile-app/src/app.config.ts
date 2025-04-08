export default {
  pages: [
    'pages/home/index',
    'pages/category/index',
    'pages/appointment/index',
    'pages/cart/index',
    'pages/user/index',
    'pages/product/detail'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '影楼商城',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/icons/home.png',
        selectedIconPath: './assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
        iconPath: './assets/icons/category.png',
        selectedIconPath: './assets/icons/category-active.png'
      },
      {
        pagePath: 'pages/appointment/index',
        text: '预约',
        iconPath: './assets/icons/appointment.png',
        selectedIconPath: './assets/icons/appointment-active.png'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: './assets/icons/user.png',
        selectedIconPath: './assets/icons/user-active.png'
      }
    ]
  }
}
