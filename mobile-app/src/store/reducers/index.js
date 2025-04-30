import { combineReducers } from 'redux';
import user from './user';

// 尝试导入 product reducer
let product = null;
try {
  product = require('./product').default;
} catch (e) {
  console.warn('无法导入 product reducer，将只使用 user reducer');
}

// 创建根 reducer
const rootReducer = product 
  ? combineReducers({ user, product }) 
  : combineReducers({ user });

export default rootReducer;
