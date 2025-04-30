import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Statistic, Tabs, DatePicker, 
  Select, Spin, Empty, Typography, Button, Radio, Tag, Divider, Tooltip 
} from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import {
  ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined,
  CameraOutlined, DollarOutlined, TeamOutlined, FileDoneOutlined,
  CalendarOutlined, PieChartOutlined, LineChartOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { Line, Pie, Column } from '../../components/Charts';
import { getBusinessAnalytics, getBusinessTrends } from '../../services/analytics';
import './BusinessAnalytics.less';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

interface BusinessData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalBookings: number;
  comparedToLastPeriod: {
    revenueChange: number;
    ordersChange: number;
    customersChange: number;
    bookingsChange: number;
  };
  topPhotographers: Array<{
    id: number;
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  topPackages: Array<{
    id: number;
    name: string;
    sales: number;
    revenue: number;
  }>;
  categoryDistribution: Array<{
    type: string;
    value: number;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
  }>;
  bookingsByDay: Array<{
    date: string;
    bookings: number;
  }>;
  customerSourceDistribution: Array<{
    source: string;
    count: number;
  }>;
}

const BusinessAnalytics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().subtract(30, 'days'), 
    moment()
  ]);
  const [timeGranularity, setTimeGranularity] = useState<'day' | 'week' | 'month'>('day');
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [trendsData, setTrendsData] = useState<any[]>([]);

  // 获取业务数据
  useEffect(() => {
    fetchBusinessData();
    fetchTrendsData();
  }, [dateRange, timeGranularity]);

  // 获取业务分析数据
  const fetchBusinessData = async () => {
    setLoading(true);
    try {
      const res = await getBusinessAnalytics({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      });
      
      setBusinessData(res.data as BusinessData);
    } catch (error) {
      console.error('获取业务分析数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取趋势数据
  const fetchTrendsData = async () => {
    try {
      const res = await getBusinessTrends({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
        granularity: timeGranularity
      });
      
      setTrendsData(res.data);
    } catch (error) {
      console.error('获取趋势数据失败:', error);
    }
  };

  // 计算日期差
  const getDaysDifference = () => {
    return dateRange[1].diff(dateRange[0], 'days') + 1;
  };

  // 渲染数据变化指标
  const renderChangeIndicator = (value: number) => {
    if (value === 0) return null;
    
    const isPositive = value > 0;
    const color = isPositive ? '#52c41a' : '#f5222d';
    const Icon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;
    
    return (
      <span style={{ color }}>
        <Icon /> {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  // 收入趋势图配置
  const revenueTrendsConfig = {
    data: trendsData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    yAxis: {
      title: { text: '金额 (元)' },
    },
    legend: { position: 'top' },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: `¥${datum.value}` };
      },
    },
    point: {
      size: 5,
      shape: 'diamond',
    },
  } as any;

  // 业务类型分布饼图配置
  const categoryDistributionConfig = {
    appendPadding: 10,
    data: businessData?.categoryDistribution || [],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'right',
    },
  } as any;

  // 客户来源饼图配置
  const customerSourceConfig = {
    appendPadding: 10,
    data: businessData?.customerSourceDistribution || [],
    angleField: 'count',
    colorField: 'source',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'right',
    },
  } as any;

  // 热门套餐柱状图配置
  const topPackagesConfig = {
    data: businessData?.topPackages || [],
    xField: 'name',
    yField: 'sales',
    label: {
      formatter: (text: any) => text.sales,
      position: 'top',
    },
    meta: {
      name: { alias: '套餐名称' },
      sales: { alias: '销售数量' },
    },
    color: '#1890ff',
    legend: { position: 'top-right' },
  } as any;

  return (
    <div className="business-analytics-page">
      <Card className="filter-card">
        <div className="filter-header">
          <Title level={4}>业务分析</Title>
          
          <div className="filter-controls">
            <RangePicker 
              value={dateRange}
              onChange={(dates: RangePickerProps['value']) => 
                dates && setDateRange(dates as [moment.Moment, moment.Moment])}
              allowClear={false}
              style={{ marginRight: 16 }}
            />
            
            <Select 
              value={timeGranularity}
              onChange={setTimeGranularity}
              style={{ width: 100 }}
            >
              <Option value="day">日</Option>
              <Option value="week">周</Option>
              <Option value="month">月</Option>
            </Select>
            
            <Button 
              type="primary" 
              onClick={fetchBusinessData} 
              style={{ marginLeft: 16 }}
            >
              刷新
            </Button>
          </div>
        </div>
        
        <div className="date-range-info">
          <CalendarOutlined /> 当前选择: {dateRange[0].format('YYYY-MM-DD')} 至 {dateRange[1].format('YYYY-MM-DD')}，共 {getDaysDifference()} 天
        </div>
      </Card>
      
      <Spin spinning={loading}>
        {!businessData ? (
          <Empty description="暂无数据" />
        ) : (
          <div className="analytics-content">
            {/* 顶部统计卡片 */}
            <Row gutter={[16, 16]} className="stats-row">
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title={
                      <div className="stat-title">
                        <span>总收入</span>
                        <Tooltip title="所选时间范围内的总收入">
                          <InfoCircleOutlined style={{ marginLeft: 5 }} />
                        </Tooltip>
                      </div>
                    }
                    value={businessData.totalRevenue}
                    precision={2}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<DollarOutlined />}
                    suffix={
                      <span className="stat-change">
                        {renderChangeIndicator(businessData.comparedToLastPeriod.revenueChange)}
                      </span>
                    }
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title={
                      <div className="stat-title">
                        <span>订单总数</span>
                        <Tooltip title="所选时间范围内的订单总数">
                          <InfoCircleOutlined style={{ marginLeft: 5 }} />
                        </Tooltip>
                      </div>
                    }
                    value={businessData.totalOrders}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<FileDoneOutlined />}
                    suffix={
                      <span className="stat-change">
                        {renderChangeIndicator(businessData.comparedToLastPeriod.ordersChange)}
                      </span>
                    }
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title={
                      <div className="stat-title">
                        <span>客户总数</span>
                        <Tooltip title="所选时间范围内的独立客户数">
                          <InfoCircleOutlined style={{ marginLeft: 5 }} />
                        </Tooltip>
                      </div>
                    }
                    value={businessData.totalCustomers}
                    valueStyle={{ color: '#722ed1' }}
                    prefix={<TeamOutlined />}
                    suffix={
                      <span className="stat-change">
                        {renderChangeIndicator(businessData.comparedToLastPeriod.customersChange)}
                      </span>
                    }
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title={
                      <div className="stat-title">
                        <span>预约总数</span>
                        <Tooltip title="所选时间范围内的预约总数">
                          <InfoCircleOutlined style={{ marginLeft: 5 }} />
                        </Tooltip>
                      </div>
                    }
                    value={businessData.totalBookings}
                    valueStyle={{ color: '#fa8c16' }}
                    prefix={<CameraOutlined />}
                    suffix={
                      <span className="stat-change">
                        {renderChangeIndicator(businessData.comparedToLastPeriod.bookingsChange)}
                      </span>
                    }
                  />
                </Card>
              </Col>
            </Row>
            
            {/* 趋势图表 */}
            <Card className="trends-card" title={
              <div className="card-title-with-icon">
                <LineChartOutlined /> 业务趋势
              </div>
            }>
              {trendsData.length > 0 ? (
                <Tabs defaultActiveKey="revenue">
                  <TabPane tab="收入趋势" key="revenue">
                    <Line {...revenueTrendsConfig} height={350} />
                  </TabPane>
                  <TabPane tab="预约趋势" key="bookings">
                    <Line 
                      {...revenueTrendsConfig} 
                      height={350}
                      yAxis={{ title: { text: '预约数量' } }}
                    />
                  </TabPane>
                </Tabs>
              ) : (
                <Empty description="暂无趋势数据" />
              )}
            </Card>
            
            {/* 分析图表 */}
            <Row gutter={[16, 16]} className="analysis-row">
              <Col xs={24} lg={12}>
                <Card className="chart-card" title={
                  <div className="card-title-with-icon">
                    <PieChartOutlined /> 业务类型分布
                  </div>
                }>
                  <Pie {...categoryDistributionConfig} height={300} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card className="chart-card" title={
                  <div className="card-title-with-icon">
                    <PieChartOutlined /> 客户来源分布
                  </div>
                }>
                  <Pie {...customerSourceConfig} height={300} />
                </Card>
              </Col>
            </Row>
            
            {/* 热门套餐排行 */}
            <Card className="top-packages-card" title={
              <div className="card-title-with-icon">
                <LineChartOutlined /> 热门套餐排行
              </div>
            }>
              <Column {...topPackagesConfig} height={300} />
            </Card>
            
            {/* 摄影师业绩排行 */}
            <Card className="photographer-performance-card" title="摄影师业绩排行">
              <div className="performance-table">
                <div className="table-header">
                  <div className="rank-cell">排名</div>
                  <div className="name-cell">摄影师</div>
                  <div className="data-cell">预约数量</div>
                  <div className="data-cell">收入</div>
                  <div className="rating-cell">评分</div>
                </div>
                
                <div className="table-body">
                  {businessData.topPhotographers.map((photographer, index) => (
                    <div key={photographer.id} className="table-row">
                      <div className="rank-cell">
                        <Tag color={index < 3 ? ['gold', 'silver', 'bronze'][index] : 'default'}>
                          {index + 1}
                        </Tag>
                      </div>
                      <div className="name-cell">{photographer.name}</div>
                      <div className="data-cell">{photographer.bookings}</div>
                      <div className="data-cell">¥{photographer.revenue.toLocaleString()}</div>
                      <div className="rating-cell">
                        <Tag color={photographer.rating >= 4.5 ? 'green' : 'blue'}>
                          {photographer.rating.toFixed(1)}
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default BusinessAnalytics;
