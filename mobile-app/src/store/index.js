import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import React from 'react';

// 创建一个 AppContext
export const AppContext = React.createContext({
  theme: 'light',
  language: 'zh-CN',
  updateContext: () => {}
});

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunkMiddleware)
);

export default function configStore() {
  const store = createStore(rootReducer, enhancer);
  return store;
}
