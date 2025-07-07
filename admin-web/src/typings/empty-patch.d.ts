import 'antd';

// 为Ant Design Empty组件添加缺少的常量属性声明
declare module 'antd' {
  interface EmptyType {
    PRESENTED_IMAGE_DEFAULT: React.ReactNode;
    PRESENTED_IMAGE_SIMPLE: React.ReactNode;
  }
  
  interface EmptyProps {
    className?: string;
    description?: React.ReactNode;
    image?: React.ReactNode;
    imageStyle?: React.CSSProperties;
    style?: React.CSSProperties;
  }
  
  // 修复Empty组件类型，添加静态属性
  export const Empty: React.FC<EmptyProps> & EmptyType;
}
