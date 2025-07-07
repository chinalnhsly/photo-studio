import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Select, DatePicker, Statistic, Table, 
  Progress, Divider, Spin, Empty, Typography, Tag, List, Space 
} from 'antd';
import { Line, Pie } from '@ant-design/charts';
import { WordCloud } from '@ant-design/plots';
import moment from 'moment';
import { 
  StarOutlined, LikeOutlined, MessageOutlined, TeamOutlined,
  RiseOutlined, FallOutlined, FileTextOutlined
} from '@ant-design/icons';
import { 
  getReviewStats, getReviewTrends, getReviewKeywords,
  getTopReviewedProducts, getPhotographerReviewSummary
} from '../../services/review';
import { getPhotographerList } from '../../services/photographer';
import './ReviewAnalytics.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// 类型定义
type MomentRange = [moment.Moment, moment.Moment];

const ReviewAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [dateRange, setDateRange] = useState<MomentRange>([
    moment().startOf('month'),
    moment().endOf('month')
  ]);
  const [selectedPhotographer, setSelectedPhotographer] = useState<number | undefined>(undefined);
  
  const [photographers, setPhotographers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    total: 0,
    average: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
    recommended: 0,
    anonymous: 0
  });
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [keywordsData, setKeywordsData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [photographerReviews, setPhotographerReviews] = useState<any[]>([]);
  
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
      const statsResponse = await getReviewStats({
        photographerId: selectedPhotographer
      });
      setStats(statsResponse.data);
      
      // 获取趋势数据
      const trendsResponse = await getReviewTrends(params);
      setTrendsData(trendsResponse.data);
      
      // 获取关键词分析
      const keywordsResponse = await getReviewKeywords({
        photographerId: selectedPhotographer,
        limit: 50
      });
      setKeywordsData(keywordsResponse.data);
      
      // 获取热门产品
      const topProductsResponse = await getTopReviewedProducts(params);
      setTopProducts(topProductsResponse.data);
      
      // 获取摄影师评价统计
      const photographerReviewsResponse = await getPhotographerReviewSummary(params);
      setPhotographerReviews(photographerReviewsResponse.data);
      
    } catch (error) {
      console.error('获取分析数据失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理时间范围选择
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
  
  // 评价趋势图配置
  const trendChartConfig = {
    data: trendsData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    yAxis: {
      title: {
        text: '评价数量',
      },
    },
    legend: {
      position: 'top' as const,
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
  
  // 评分分布图表配置
  const ratingChartConfig = {
    appendPadding: 10,
    data: [
      { type: '5星', value: stats.distribution[5] || 0 },
      { type: '4星', value: stats.distribution[4] || 0 },
      { type: '3星', value: stats.distribution[3] || 0 },
      { type: '2星', value: stats.distribution[2] || 0 },
      { type: '1星', value: stats.distribution[1] || 0 },
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
      position: 'bottom' as const,
    },
    pieStyle: {
      lineWidth: 0,
    },
  };
  
  // 词云图配置
  const wordCloudConfig = {
    data: keywordsData,
    wordField: 'name',
    weightField: 'value',
    colorField: 'name',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [12, 48] as [number, number],
      rotation: 0,
    },
    random: () => 0.5,
  };
  
  // 摄影师评价表格列
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
      title: '评价总数',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      sorter: (a: any, b: any) => a.reviewCount - b.reviewCount,
      defaultSortOrder: 'descend' as 'descend',
    },
    {
      title: '平均评分',
      dataIndex: 'avgRating',
      key: 'avgRating',
      sorter: (a: any, b: any) => a.avgRating - b.avgRating,
      render: (rating: number) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <span>{rating?.toFixed(1) || '0.0'}</span>
        </Space>
      ),
    },
    {
      title: '推荐率',
      dataIndex: 'recommendRate',
      key: 'recommendRate',
      sorter: (a: any, b: any) => a.recommendRate - b.recommendRate,
      render: (rate: number) => (
        <Progress 
          percent={rate * 100} 
          size="small" 
          format={(percent: number | undefined) => `${percent?.toFixed(1)}%`}
        />
      ),
    },
    {
      title: '满意度',
      dataIndex: 'satisfactionRate',
      key: 'satisfactionRate',
      sorter: (a: any, b: any) => a.satisfactionRate - b.satisfactionRate,
      render: (rate: number) => {
        let color = '#52c41a';
        if (rate < 0.7) color = '#ff4d4f';
        else if (rate < 0.9) color = '#faad14';
        
        return (
          <Progress 
            percent={rate * 100} 
            size="small" 
            strokeColor={color}
            format={(percent: number | undefined) => `${percent?.toFixed(1)}%`}
          />
        );
      },
    },
  ];
  
  // 热门产品列定义
  const productColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '评价数量',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      sorter: (a: any, b: any) => a.reviewCount - b.reviewCount,
      defaultSortOrder: 'descend' as 'descend',
    },
    {
      title: '平均评分',
      dataIndex: 'avgRating',
      key: 'avgRating',
      sorter: (a: any, b: any) => a.avgRating - b.avgRating,
      render: (rating: number) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <span>{rating?.toFixed(1) || '0.0'}</span>
        </Space>
      ),
    },
    {
      title: '好评率',
      dataIndex: 'positiveRate',
      key: 'positiveRate',
      sorter: (a: any, b: any) => a.positiveRate - b.positiveRate,
      render: (rate: number) => (
        <Progress 
          percent={rate * 100} 
          size="small" 
          strokeColor="#52c41a"
          format={(percent: number | undefined) => `${percent?.toFixed(1)}%`}
        />
      ),
    },
  ];

  return (
    <div className="review-analytics-page">
      <div className="header-section">
        <Card>
          <div className="header-content">
            <div className="title-section">
              <Title level={4}>评价数据分析</Title>
              <Text type="secondary">查看客户评价数据分析和品质评估</Text>
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
                onChange={(dates: MomentRange | null) => dates && setDateRange(dates)}
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
                title="评价总数"
                value={stats.total}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          
          <Col span={6}>
            <Card>
              <Statistic
                title="平均评分"
                value={stats.average}
                precision={1}
                prefix={<StarOutlined />}
                valueStyle={{ color: '#faad14' }}
                suffix="/5.0"
              />
            </Card>
          </Col>
          
          <Col span={6}>
            <Card>
              <Statistic
                title="推荐率"
                value={stats.total > 0 ? (stats.recommended / stats.total * 100).toFixed(1) : 0}
                precision={1}
                prefix={<LikeOutlined />}
                valueStyle={{ color: '#52c41a' }}
                suffix="%"
              />
            </Card>
          </Col>
          
          <Col span={6}>
            <Card>
              <Statistic
                title="匿名评价"
                value={stats.total > 0 ? (stats.anonymous / stats.total * 100).toFixed(1) : 0}
                precision={1}
                prefix={<TeamOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]}>
          <Col span={16}>
            <Card 
              title="评价趋势" 
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
            <Card title="评分分布" className="chart-card">
              {stats.total > 0 ? (
                <Pie {...ratingChartConfig} height={350} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]} className="word-cloud-section">
          <Col span={24}>
            <Card title="评价关键词" className="chart-card">
              {keywordsData.length > 0 ? (
                <WordCloud {...wordCloudConfig} height={400} />
              ) : (
                <Empty description="暂无关键词数据" />
              )}
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card title="摄影师评价排行" className="chart-card">
              <Table
                dataSource={photographerReviews}
                columns={photographerColumns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            </Card>
          </Col>
          
          <Col span={12}>
            <Card title="热门产品评价" className="chart-card">
              <Table
                dataSource={topProducts}
                columns={productColumns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default ReviewAnalytics;
