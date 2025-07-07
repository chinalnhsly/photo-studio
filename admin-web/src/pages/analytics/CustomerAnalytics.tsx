import React, { useState } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select, Button, Spin, Empty } from 'antd';
// 修改路径从别名导入为相对路径导入
import { Line, Pie } from '../../components/Charts';
import { BarChartOutlined, TeamOutlined } from '@ant-design/icons';
import './CustomerAnalytics.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const CustomerAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="customer-analytics-page">
      <Card className="filter-card">
        <div className="filters">
          <div>
            <span className="filter-label">日期范围:</span>
            <RangePicker style={{ width: 280 }} />
          </div>
          <div>
            <span className="filter-label">客户来源:</span>
            <Select defaultValue="all" style={{ width: 160 }}>
              <Option value="all">全部来源</Option>
              <Option value="online">线上平台</Option>
              <Option value="offline">门店咨询</Option>
              <Option value="referral">转介绍</Option>
            </Select>
          </div>
          <div>
            <Button type="primary">查询</Button>
          </div>
        </div>
      </Card>

      <Row gutter={16} className="stat-row">
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="总客户数"
              value={428}
              prefix={<TeamOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="本月新增"
              value={42}
              prefix={<TeamOutlined />}
              suffix="人"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="客户转化率"
              value={32.8}
              prefix={<BarChartOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Card className="chart-card" title="客户增长趋势">
        <Spin spinning={loading}>
          <div style={{ height: 300 }}>
            <Line />
          </div>
        </Spin>
      </Card>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card className="chart-card" title="客户来源分布">
            <Spin spinning={loading}>
              <div style={{ height: 300 }}>
                <Pie />
              </div>
            </Spin>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="chart-card" title="客户消费层级分布">
            <Spin spinning={loading}>
              <div style={{ height: 300 }}>
                <Pie />
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>

      <Card className="chart-card" title="客户行为分析">
        <Spin spinning={loading}>
          <Empty description="暂无数据" />
        </Spin>
      </Card>
    </div>
  );
};

export default CustomerAnalytics;
