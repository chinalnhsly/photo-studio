import React from 'react';
import { Image } from 'antd';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  imageSettings?: {
    src: string;
    height?: number;
    width?: number;
    excavate?: boolean;
  };
  // 添加其他 qrcode.react 可能支持的属性
  [key: string]: any;
}

// 模拟的 QRCode 组件
const QRCode: React.FC<QRCodeProps> = ({ 
  value, 
  size = 128,
  // 其他属性不使用
  ...rest
}) => {
  // 创建一个简单的占位图像，显示二维码
  return (
    <div style={{ width: size, height: size }}>
      <Image
        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`}
        alt="QR Code"
        style={{ width: size, height: size }}
        preview={false}
      />
      <div style={{ fontSize: '12px', marginTop: '4px', color: '#999', textAlign: 'center' }}>
        二维码内容: {value.length > 20 ? value.substring(0, 20) + '...' : value}
      </div>
    </div>
  );
};

export default QRCode;
