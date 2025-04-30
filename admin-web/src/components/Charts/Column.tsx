import React from 'react';
import { Empty } from 'antd';

// 简易版柱状图组件，用于替代 @ant-design/charts 的 Column
const Column: React.FC<any> = (props) => {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty 
        description={
          <span>
            <div style={{ fontWeight: 'bold' }}>柱状图</div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              请安装 @ant-design/charts 使用完整图表功能
            </div>
          </span>
        }
      />
    </div>
  );
};

export default Column;
