import React, { useState, useEffect } from 'react';
import { 
  Card, Descriptions, Tag, Button, Image, Divider, 
  Typography, Row, Col, List, Spin, message
} from 'antd';
import { 
  EditOutlined, ArrowLeftOutlined, 
  PictureOutlined, CheckCircleOutlined 
} from '@ant-design/icons';
import { useParams } from 'umi';
import { history } from '../../utils/compatibility'; // 修改这里，使用兼容层的 history
import './PackageDetail.less';

const { Title, Paragraph } = Typography;

// 这里为简化示例，使用模拟数据
const mockPackageData = {
  id: 1,
  name: '婚纱摄影豪华套餐',
  price: 6999,
  originalPrice: 9999,
  category: '婚纱摄影',
  status: 'active',
  description: '我们的婚纱摄影豪华套餐为您提供全面的服务，包括多场景拍摄、精美相册和专业后期处理，让您的婚纱照更加完美。',
  features: [
    '20张精修照片',
    '3套高级服装',
    '3个拍摄场景',
    '5小时拍摄时间',
    '1本精装相册',
    '化妆造型服务',
    '专车接送服务',
  ],
  cover: 'https://via.placeholder.com/800/FF5733/FFFFFF?text=Wedding+Package',
  gallery: [
    'https://via.placeholder.com/600/33A8FF/FFFFFF?text=Sample+1',
    'https://via.placeholder.com/600/33FF57/FFFFFF?text=Sample+2',
    'https://via.placeholder.com/600/A833FF/FFFFFF?text=Sample+3',
    'https://via.placeholder.com/600/FF33A8/FFFFFF?text=Sample+4',
  ],
  salesCount: 125,
  createdAt: '2023-02-10 09:00:00',
  updatedAt: '2023-06-15 11:30:00',
  photographer: {
    id: 2,
    name: '张摄影',
    avatar: 'https://via.placeholder.com/100/33FF57/FFFFFF?text=P',
  },
};

// 套餐状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  active: { color: 'green', text: '已上架' },
  inactive: { color: 'default', text: '已下架' },
  soldout: { color: 'red', text: '已售罄' },
  coming: { color: 'blue', text: '即将推出' },
};

const PackageDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [packageData, setPackageData] = useState<any>(null);

  useEffect(() => {
    fetchPackageData();
  }, [params.id]);

  const fetchPackageData = async () => {
    try {
      setLoading(true);
      // 实际项目中这里应该调用API获取套餐数据
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPackageData(mockPackageData);
    } catch (error) {
      message.error('获取套餐信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 编辑套餐
  const handleEdit = () => {
    history.push(`/package/edit/${params.id}`);
  };

  // 返回列表页
  const handleBack = () => {
    history.push('/package/list');
  };

  if (loading) {
    return (
      <div className="package-detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="package-detail-error">
        <Result
          status="404"
          title="套餐不存在"
          subTitle="您查找的套餐不存在或已被删除"
          extra={
            <Button type="primary" onClick={handleBack}>
              返回套餐列表
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="package-detail-page">
      {/* 操作栏 */}
      <Card className="action-card">
        <div className="detail-actions">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回套餐列表
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
          >
            编辑套餐
          </Button>
        </div>
      </Card>
      
      {/* 套餐基本信息 */}
      <Card className="detail-card">
        <div className="package-header">
          <div className="package-title">
            <Title level={3}>{packageData.name}</Title>
            <Tag color={statusMap[packageData.status]?.color}>
              {statusMap[packageData.status]?.text}
            </Tag>
          </div>
          <div className="package-price">
            <span className="current-price">¥{packageData.price}</span>
            {packageData.originalPrice && packageData.originalPrice > packageData.price && (
              <span className="original-price">¥{packageData.originalPrice}</span>
            )}
          </div>
        </div>
        
        <Divider />
        
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <div className="package-cover">
              <Image
                src={packageData.cover}
                alt={packageData.name}
                width="100%"
              />
            </div>
          </Col>
          
          <Col xs={24} md={12}>
            <Descriptions 
              title="套餐详情" 
              bordered 
              column={1} 
              size="middle"
              className="package-descriptions"
            >
              <Descriptions.Item label="套餐类型">{packageData.category}</Descriptions.Item>
              <Descriptions.Item label="销量">{packageData.salesCount}次</Descriptions.Item>
              <Descriptions.Item label="创建时间">{packageData.createdAt}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{packageData.updatedAt}</Descriptions.Item>
              <Descriptions.Item label="指定摄影师">
                {packageData.photographer ? (
                  <div className="photographer-info">
                    <Avatar src={packageData.photographer.avatar} size="small" />
                    <span className="photographer-name">{packageData.photographer.name}</span>
                  </div>
                ) : '不限'}
              </Descriptions.Item>
            </Descriptions>

            <div className="package-features">
              <Title level={5}>套餐包含</Title>
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={packageData.features}
                renderItem={(item: string) => (
                  <List.Item>
                    <div className="feature-item">
                      <CheckCircleOutlined className="feature-icon" />
                      <span>{item}</span>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
        
        <div className="package-description">
          <Title level={5}>套餐说明</Title>
          <Paragraph>{packageData.description}</Paragraph>
        </div>
        
        <Divider />
        
        <div className="package-gallery">
          <Title level={5}>套餐案例展示</Title>
          <div className="gallery-container">
            {packageData.gallery && packageData.gallery.length > 0 ? (
              <Image.PreviewGroup>
                <Row gutter={16}>
                  {packageData.gallery.map((image: string, index: number) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                      <div className="gallery-item">
                        <Image src={image} alt={`案例 ${index + 1}`} />
                      </div>
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            ) : (
              <div className="no-gallery">
                <PictureOutlined />
                <p>暂无案例展示</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// 临时导入组件，实际项目中应该从正确位置导入
import { Result, Avatar } from 'antd';

export default PackageDetail;
