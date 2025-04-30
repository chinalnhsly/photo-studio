import React from 'react';
import { Spin } from 'antd';
import './index.less';

const PageLoading: React.FC<{ tip?: string }> = ({ tip = '加载中...' }) => {
  return (
    <div className="page-loading">
      <Spin size="large" tip={tip} />
    </div>
  );
};

export default PageLoading;
