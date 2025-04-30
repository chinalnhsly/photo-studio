import React from 'react';
// 扩展 CSS 属性类型
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

// 图片文件类型声明
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg' {
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}