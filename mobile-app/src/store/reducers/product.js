// 商品相关reducer
const INITIAL_STATE = {
  products: [],
  loading: false,
  error: null
};

// Action Types
const FETCH_PRODUCTS_START = 'FETCH_PRODUCTS_START';
const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

// Action Creators
export const fetchProductsStart = () => ({
  type: FETCH_PRODUCTS_START
});

export const fetchProductsSuccess = (products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products
});

export const fetchProductsFailure = (error) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error
});

// Async Action Creator
export const fetchProducts = () => {
  return dispatch => {
    dispatch(fetchProductsStart());
    
    // 模拟API请求
    setTimeout(() => {
      const products = [
        {
          id: '1',
          title: '韩式婚纱摄影',
          price: 3999,
          image: 'https://placehold.co/300x200/E6E6FA/333?text=婚纱套餐',
          originalPrice: 5999,
          sales: 128
        },
        {
          id: '2',
          title: '小清新写真',
          price: 999,
          image: 'https://placehold.co/300x200/FFF8DC/333?text=写真套餐',
          originalPrice: 1599,
          sales: 256
        },
        {
          id: '3',
          title: '全家福套餐',
          price: 1299,
          image: 'https://placehold.co/300x200/F0FFF0/333?text=全家福',
          originalPrice: 1999,
          sales: 86
        }
      ];
      
      dispatch(fetchProductsSuccess(products));
    }, 1000);
  };
};

// Reducer
export default function product(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PRODUCTS_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: null
      };
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
