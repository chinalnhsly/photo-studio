import React, { useEffect, useState } from 'react';
import { 
  Card, Descriptions, Button, Tag, Tabs, Image, Row, Col, 
  Space, Popconfirm, message, Modal, Switch 
} from 'antd';
import { 
  EditOutlined, ArrowLeftOutlined, PhoneOutlined, 
  EnvironmentOutlined, ClockCircleOutlined, TeamOutlined 
} from '@ant-design/icons';
import { history, useParams } from 'umi';
import { 
  getStudioById, 
  updateStudio
} from '@/services/studio';
import styles from './StudioDetail.less';

const StudioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [studio, setStudio] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudioData();
  }, []);

  const fetchStudioData = async () => {
    try {
      setLoading(true);
      const response = await getStudioById(Number(id));
      setStudio(response.data);
    } catch (error) {
      message.error('获取工作室详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新工作室状态
  const handleStatusChange = async (checked: boolean) => {
    try {
      await updateStudio(Number(id), { status: checked ? 'active' : 'maintenance' });
      message.success(`工作室已${checked ? '启用' : '设为维护中'}`);
      fetchStudioData(); // 刷新数据
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  if (loading || !studio) {
    return <Card loading={true} />;
  }

  // 使用 items 属性代替 TabPane 子组件
  const tabItems = [
    {
      label: '基本信息',
      key: 'info',
      children: (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="工作室名称">{studio.name}</Descriptions.Item>
          <Descriptions.Item label="地址">{studio.address}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{studio.phone}</Descriptions.Item>
          <Descriptions.Item label="面积">{studio.area} 平方米</Descriptions.Item>
          <Descriptions.Item label="最大容纳人数">{studio.capacity} 人</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Switch
              checked={studio.status === 'active'}
              onChange={handleStatusChange}
              checkedChildren="营业中"
              unCheckedChildren="维护中"
            />
          </Descriptions.Item>
        </Descriptions>
      )
    },
    {
      label: '图片展示',
      key: 'gallery',
      children: (
        <div className={styles.galleryContainer}>
          {studio.images && studio.images.map((url: string, index: number) => (
            <Image
              key={index}
              src={url}
              alt={`Studio image ${index}`}
              width={200}
              height={150}
              className={styles.galleryImage}
            />
          ))}
        </div>
      )
    },
    {
      label: '设备设施',
      key: 'facilities',
      children: (
        <div className={styles.facilitiesList}>
          {studio.facilities && studio.facilities.map((facility: any) => (
            <Tag key={facility.id || facility}>{facility.name || facility}</Tag>
          ))}
        </div>
      )
    }
  ];

  return (
    <Card
      title={
        <div className={styles.detailHeader}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => history.push('/studio/list')}
          >
            返回列表
          </Button>
          <span className={styles.studioName}>{studio.name}</span>
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => history.push(`/studio/edit/${id}`)}
        >
          编辑工作室
        </Button>
      }
    >
      <Tabs items={tabItems} />
    </Card>
  );
};

export default StudioDetail;