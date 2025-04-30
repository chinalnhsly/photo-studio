import React from 'react';
import { history } from 'umi';
import { Result, Button } from 'antd';

export default () => {
  React.useEffect(() => {
    // 自动重定向到仪表盘页面
    history.push('/dashboard');
  }, []);

  return (
    <Result
      status="info"
      title="正在加载系统..."
      extra={
        <Button type="primary" onClick={() => history.push('/dashboard')}>
          前往仪表盘
        </Button>
      }
    />
  );
};
