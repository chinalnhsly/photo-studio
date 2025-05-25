import React from 'react';
import { Card, Empty, Button, EmptyProps } from 'antd';
import { history } from 'umi';

/**
 * 预约管理首页 - 路由重定向
 */
const BookingIndex: React.FC = () => {
  // 自动重定向到预约列表
  React.useEffect(() => {
    history.replace('/booking/list');
  }, []);

  return (
    <Card title="预约管理">
      <Empty 
        description="正在跳转到预约列表..." 
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      >
        <Button type="primary" onClick={() => history.push('/booking/list')}>
          立即前往预约列表
        </Button>
      </Empty>
    </Card>
  );
};

export default BookingIndex;
