import React from 'react';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale/zh_CN';
import { notification } from 'antd';

// 配置通知默认配置，避免 findDOMNode 警告
notification.config({
  placement: 'topRight',
  duration: 3,
});

export function rootContainer(container: React.ReactNode) {
  return (
    <ConfigProvider locale={zh_CN}>
      {container}
    </ConfigProvider>
  );
}

// 全局初始化数据配置
export async function getInitialState() {
  return {
    name: '摄影工作室管理系统',
    version: '1.0.0',
  };
}

// 错误处理方案
export const request = {
  errorHandler: (error: any) => {
    console.log('API错误：', error);
  },
};
