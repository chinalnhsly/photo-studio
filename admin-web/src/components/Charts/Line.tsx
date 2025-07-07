import React from 'react';
import { Empty } from 'antd';

// 简易版折线图组件，用于替代 @ant-design/charts 的 Line
const Line: React.FC<any> = (props) => {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty 
        description={
          <span>
            <div style={{ fontWeight: 'bold' }}>折线图</div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              请安装 @ant-design/charts 使用完整图表功能
            </div>
          </span>
        }
      />
    </div>
  );
};

export default Line;
