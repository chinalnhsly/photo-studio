export default {
  pages: [
    'pages/home/index',
    'pages/category/index',
    'pages/cart/index',
    'pages/user/index',
    'pages/login/index',
    // ...其他现有页面
  ],
  subPackages: [
    {
      root: 'pages/product',
      pages: [
        'list/index',
        'detail/index',
        'search/index',
        'reviews/index',
        'reviews/detail', // 新增评价详情页
      ]
    },
    {
      root: 'pages/order',
      pages: [
        'list/index',
        'detail/index',
        'create/index',
        'payment/index',
        'success/index',
        'review/index', // 添加评价页
        'review/success', // 添加评价成功页面
      ]
    },
    {
      root: 'pages/user',
      pages: [
        'profile/index',
        'address/index',
        'address/edit',
        'favorite/index',
        'settings/index',
        'coupons/index',
        'coupons/center',
        'reviews/index', // 新增用户评价管理页
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '影楼商城',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#1890ff',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
        iconPath: 'assets/icons/category.png',
        selectedIconPath: 'assets/icons/category-active.png'
      },
      {
        pagePath: 'pages/cart/index',
        text: '购物车',
        iconPath: 'assets/icons/cart.png',
        selectedIconPath: 'assets/icons/cart-active.png'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: 'assets/icons/user.png',
        selectedIconPath: 'assets/icons/user-active.png'
      }
    ]
  }
};
