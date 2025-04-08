/// <reference types="@tarojs/taro" />
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="webpack-env" />

// 静态资源模块声明
declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

// 环境变量类型
declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
}

// JSX 类型定义
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> { }
  interface ElementClass extends React.Component<any> {
    render(): React.ReactNode;
  }
  interface IntrinsicElements {
    // 只保留一个通用的索引签名
    [tagName: string]: any;
  }
}
