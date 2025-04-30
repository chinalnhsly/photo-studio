// UMI 类型声明补充
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

// 解决 FieldTimeOutlined 图标类型问题
declare module '@ant-design/icons/lib/icons/FieldTimeOutlined' {
  import React from 'react';
  const FieldTimeOutlined: React.ForwardRefExoticComponent<React.RefAttributes<HTMLSpanElement>>;
  export default FieldTimeOutlined;
}

// UMI 3.x 相关类型声明
declare module 'umi' {
  export { history, useModel, useRequest } from '@umijs/runtime';
  export { Link, NavLink, Redirect, useRouteMatch, useParams, useLocation } from 'react-router-dom';
}

// 全局变量声明
declare const REACT_APP_ENV: 'dev' | 'test' | 'prod' | false;
