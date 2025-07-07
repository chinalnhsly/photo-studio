import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Select, DatePicker, Statistic, Table, 
  Progress, Divider, Spin, Empty, Typography, Tag, Tabs 
} from 'antd';
import { Line, Pie, Column } from '../../components/Charts';
import moment from 'moment';
import { 
  TeamOutlined, CalendarOutlined, DollarOutlined, 
  RiseOutlined, FallOutlined, CheckCircleOutlined 
} from '@ant-design/icons';
import { getBookingStats, getBookingTrends, getPhotographerWorkload } from '../../services/booking';
import { getPhotographerList } from '../../services/photographer';
import './BookingAnalytics.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const BookingAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().startOf('month'),
    moment().endOf('month')
  ]);
  const [selectedPhotographer, setSelectedPhotographer] = useState<number | undefined>(undefined);
  
  const [photographers, setPhotographers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    total: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
    comparedToLastPeriod: {
      totalChange: 0,
      completedChange: 0,
      cancelledChange: 0,
      revenueChange: 0
    }
  });
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [photographerStats, setPhotographerStats] = useState<any[]>([]);
  
  useEffect(() => {
    fetchPhotographers();
  }, []);
  
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, dateRange, selectedPhotographer]);
  
  // 获取摄影师列表
  const fetchPhotographers = async () => {
    try {
      const response = await getPhotographerList({ isActive: true, limit: 100 });
      setPhotographers(response.data.items);
    } catch (error) {
      console.error('获取摄影师列表失败:', error);
    }
  };
  
  // 获取分析数据
  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    try {
      // 构建查询参数
      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
        photographerId: selectedPhotographer,
      };
      
      // 获取统计数据
      const statsResponse = await getBookingStats(params);
      setStats(statsResponse.data);
      
      // 获取趋势数据
      const trendsResponse = await getBookingTrends({
        ...params,
        interval: getTimeInterval()
      } as any);
      setTrendsData(trendsResponse.data);
      
      // 获取摄影师工作量数据
      const workloadResponse = await getPhotographerWorkload(params);
      setPhotographerStats(workloadResponse.data);
      
    } catch (error) {
      console.error('获取分析数据失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 根据时间范围获取时间间隔
  const getTimeInterval = () => {
    const days = dateRange[1].diff(dateRange[0], 'days');
    
    if (days <= 31) {
      return 'day';
    } else if (days <= 90) {
      return 'week';
    } else {
      return 'month';
    }
  };
  
  // 处理日期范围选择
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    
    // 根据选择的时间范围设置日期
    let start, end;
    
    switch (value) {
      case 'today':
        start = moment().startOf('day');
        end = moment().endOf('day');
        break;
      case 'yesterday':
        start = moment().subtract(1, 'day').startOf('day');
        end = moment().subtract(1, 'day').endOf('day');
        break;
      case 'week':
        start = moment().startOf('week');
        end = moment().endOf('week');
        break;
      case 'lastWeek':
        start = moment().subtract(1, 'week').startOf('week');
        end = moment().subtract(1, 'week').endOf('week');
        break;
      case 'month':
        start = moment().startOf('month');
        end = moment().endOf('month');
        break;
      case 'lastMonth':
        start = moment().subtract(1, 'month').startOf('month');
        end = moment().subtract(1, 'month').endOf('month');
        break;
      case 'quarter':
        start = moment().startOf('quarter');
        end = moment().endOf('quarter');
        break;
      case 'year':
        start = moment().startOf('year');
        end = moment().endOf('year');
        break;
      default:
        start = moment().startOf('month');
        end = moment().endOf('month');
    }
    
    setDateRange([start, end]);
  };
  
  // 渲染趋势变化箭头
  const renderTrendIcon = (value: number) => {
    if (value > 0) {
      return <RiseOutlined style={{ color: '#52c41a' }} />;
    } else if (value < 0) {
      return <FallOutlined style={{ color: '#f5222d' }} />;
    }
    return null;
  };
  
  // 预约趋势图配置
  const trendChartConfig = {
    data: trendsData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    yAxis: {
      title: {
        text: '预约数量',
      },
    },
    legend: {
      position: 'top-right' as 'top-right',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 800,
      },
    },
    point: {
      size: 4,
      shape: 'circle',
      style: {
        stroke: '#fff',
        lineWidth: 2,
      },
    },
  };
  
  // 摄影师工作量图表配置
  const photographerChartConfig = {
    data: photographerStats,
    xField: 'name',
    yField: 'bookings',
    label: {
      position: 'middle' as any,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      name: { alias: '摄影师' },
      bookings: { alias: '预约数量' },
    },
    color: '#1890ff',
  };
  
  // 预约状态分布图表配置
  const statusChartConfig = {
    appendPadding: 10,
    data: [
      { type: '已完成', value: stats.completed },
      { type: '已取消', value: stats.cancelled },
      { type: '待确认', value: stats.pending || 0 },
      { type: '已确认', value: stats.confirmed || 0 },
      { type: '已改期', value: stats.rescheduled || 0 },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
    legend: {
      position: 'bottom' as 'bottom',
    },
    pieStyle: {
      lineWidth: 0,
    },
  };
  
  // 摄影师工作量表格列
  const photographerColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '摄影师',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '预约总数',
      dataIndex: 'bookings',
      key: 'bookings',
      sorter: (a: any, b: any) => a.bookings - b.bookings,
      defaultSortOrder: 'descend' as 'descend',
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      sorter: (a: any, b: any) => a.completionRate - b.completionRate,
      render: (rate: number) => (
        <Progress 
          percent={rate * 100} 
          size="small" 
          format={(percent: number | undefined) => `${percent?.toFixed(1)}%`}
        />
      ),
    },
    {
      title: '取消率',
      dataIndex: 'cancellationRate',
      key: 'cancellationRate',
      sorter: (a: any, b: any) => a.cancellationRate - b.cancellationRate,
      render: (rate: number) => (
        <Progress 
          percent={rate * 100} 
          size="small" 
          strokeColor="#ff4d4f"
          format={(percent: number | undefined) => `${percent?.toFixed(1)}%`}
        />
      ),
    },
    {
      title: '平均评分',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a: any, b: any) => a.rating - b.rating,
      render: (rating: number) => rating?.toFixed(1) || '暂无评分',
    },
  ];
  
  return (
    <div className="booking-analytics-page">
      <div className="header-section">
        <Card>
          <div className="header-content">
            <div className="title-section">
              <Title level={4}>预约数据分析</Title>
              <Text type="secondary">查看预约数据分析和业务指标</Text>
            </div>
            
            <div className="filter-section">
              <Select
                placeholder="选择时间范围"
                style={{ width: 150, marginRight: 16 }}
                value={timeRange}
                onChange={handleTimeRangeChange}
              >
                <Option value="today">今天</Option>
                <Option value="yesterday">昨天</Option>
                <Option value="week">本周</Option>
                <Option value="lastWeek">上周</Option>
                <Option value="month">本月</Option>
                <Option value="lastMonth">上月</Option>
                <Option value="quarter">本季度</Option>
                <Option value="year">今年</Option>
                <Option value="custom">自定义</Option>
              </Select>
              
              <RangePicker
                value={dateRange}
                onChange={(dates: any) => dates && setDateRange(dates as [moment.Moment, moment.Moment])}
                style={{ width: 250, marginRight: 16 }}
                disabled={timeRange !== 'custom'}
              />
              
              <Select
                placeholder="选择摄影师"
                style={{ width: 160 }}
                allowClear
                onChange={(value: number | undefined) => setSelectedPhotographer(value)}
                value={selectedPhotographer}
              >
                {photographers.map(photographer => (
                  <Option key={photographer.id} value={photographer.id}>
                    {photographer.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Card>
      </div>
      
      <Spin spinning={loading}>
        <Row gutter={[24, 24]} className="stats-section">
          <Col span={6}>
            <Card>
              <Statistic
                title="总预约数"
                value={stats.total}
                prefix={<TeamOutlined />}
                suffix={
                  <span className="trend-indicator">
                    {stats.comparedToLastPeriod?.totalChange !== 0 && (
                      <>
                        {renderTrendIcon(stats.comparedToLastPeriod?.totalChange)}
                        <span className={stats.comparedToLastPeriod?.totalChange > 0 ? 'up' : 'down'}>
                          {Math.abs(stats.comparedToLastPeriod?.totalChange).toFixed(1)}%
                        </span>
                      </>
                    )}
                  </span>
                }
              />
            </Card>
          </Col>
          
          <Col span={6}>
            <Card>
              <Statistic
                title="已完成预约"
                value={stats.completed}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <span className="trend-indicator">
                    {stats.comparedToLastPeriod?.completedChange !== 0 && (
                      <>
                        {renderTrendIcon(stats.comparedToLastPeriod?.completedChange)}
                        <span className={stats.comparedToLastPeriod?.completedChange > 0 ? 'up' : 'down'}>
                          {Math.abs(stats.comparedToLastPeriod?.completedChange).toFixed(1)}%
                        </span>
                      </>
                    )}
                  </span>
                }
              />
            </Card>
          </Col>
          
          <Col span={6}>
            <Card>
              <Statistic
                title="预约完成率"
                value={stats.total > 0 ? (stats.completed / stats.total * 100).toFixed(1) : 0}
                suffix="%"
                precision={1}
              />
              <Progress 
                percent={stats.total > 0 ? (stats.completed / stats.total * 100) : 0} 
                showInfo={false} 
                status="active" 
              />
            </Card>
          </Col>
          
          <Col span={6}>
            <Card>
              <Statistic
                title="收入预估"
                value={stats.revenue}
                prefix={<DollarOutlined />}
                suffix={
                  <span className="trend-indicator">
                    {stats.comparedToLastPeriod?.revenueChange !== 0 && (
                      <>
                        {renderTrendIcon(stats.comparedToLastPeriod?.revenueChange)}
                        <span className={stats.comparedToLastPeriod?.revenueChange > 0 ? 'up' : 'down'}>
                          {Math.abs(stats.comparedToLastPeriod?.revenueChange).toFixed(1)}%
                        </span>
                      </>
                    )}
                  </span>
                }
                precision={2}
              />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]}>
          <Col span={16}>
            <Card 
              title="预约趋势" 
              className="chart-card"
              extra={
                <Tag color="blue">
                  {dateRange[0].format('YYYY/MM/DD')} - {dateRange[1].format('YYYY/MM/DD')}
                </Tag>
              }
            >
              {trendsData.length > 0 ? (
                <Line {...trendChartConfig} height={350} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </Card>
          </Col>
          
          <Col span={8}>
            <Card title="预约状态分布" className="chart-card">
              {stats.total > 0 ? (
                <Pie {...statusChartConfig} height={350} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </Card>
          </Col>
        </Row>
        
        <div className="photographer-section">
          <Card
            title="摄影师绩效分析"
            className="photographer-card"
            tabList={[
              { key: 'chart', tab: '图表视图' },
              { key: 'table', tab: '表格视图' },
            ]}
            tabProps={{
              size: 'middle',
            }}
            defaultActiveTabKey="chart"
          >
            <Tabs
              defaultActiveKey="chart"
              items={[
                {
                  label: '图表视图',
                  key: 'chart',
                  children: photographerStats.length > 0 ? (
                    <Column {...photographerChartConfig} height={350} />
                  ) : (
                    <Empty description="暂无数据" />
                  ),
                },
                {
                  label: '表格视图',
                  key: 'table',
                  children: (
                    <Table
                      dataSource={photographerStats}
                      columns={photographerColumns}
                      rowKey="id"
                      pagination={false}
                      size="middle"
                      className="photographer-table"
                    />
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </Spin>
    </div>
  );
};

export default BookingAnalytics;
