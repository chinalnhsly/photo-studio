import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';

export const Overview: React.FC = () => {
  return (
    <div>
      <h2>仪表盘概览</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总订单"
              value={112}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="活跃用户"
              value={93}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总收入"
              value={11280}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
