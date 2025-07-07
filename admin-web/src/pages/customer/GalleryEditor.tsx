import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  message, 
  Tabs, 
  Row, 
  Col,
  Upload, 
  Modal,
  Spin, 
  Divider,
  Checkbox,
  Empty,
  Typography,
  Tag,
  DatePicker,
  Alert,
  Descriptions
} from 'antd';
import {
  SaveOutlined,
  PictureOutlined,
  UploadOutlined,
  EditOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  EyeOutlined,
  LockOutlined,
  DragOutlined,
  CreditCardOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined // 添加缺失的图标导入
} from '@ant-design/icons';
import { useParams } from 'umi';
import { history } from '../../utils/compatibility'; // 从兼容层导入 history

// 只有在安装了相应依赖后才导入这些模块
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import update from 'immutability-helper';
// import { CopyToClipboard } from 'react-copy-to-clipboard';

import moment from 'moment';

// 临时替代方案
const DndProvider: React.FC<{backend: any, children: React.ReactNode}> = ({children}) => <>{children}</>;
const useDrag = () => [{isDragging: false}, (ref: any) => ref];
const useDrop = () => [(ref: any) => ref];
const update = {
  immutable: (obj: any, updateObj: any) => {
    if (updateObj.$splice) {
      const result = [...obj];
      updateObj.$splice.forEach((splice: [number, number, any]) => {
        const [start, deleteCount, ...items] = splice;
        result.splice(start, deleteCount, ...(items || []));
      });
      return result;
    }
    return obj;
  }
};

// 临时的 CopyToClipboard 组件
const CopyToClipboard: React.FC<{text: string, onCopy: () => void, children: React.ReactNode}> = ({children, text, onCopy}) => {
  const handleClick = () => {
    navigator.clipboard.writeText(text).then(() => {
      onCopy();
    }).catch(err => {
      console.error('无法复制到剪贴板:', err);
    });
  };
  
  return (
    <span onClick={handleClick}>
      {children}
    </span>
  );
};

import { 
  getCustomerAlbum, 
  updateCustomerAlbum, 
  addPhotosToCustomerAlbum,
  removePhotosFromCustomerAlbum,
  shareCustomerAlbum,
  getPhotos
} from '../../services/photo';

import './GalleryEditor.less';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 定义拖拽项类型
const ItemTypes = {
  PHOTO: 'photo'
};

// 添加 DraggablePhoto 组件的 props 接口
interface DraggablePhotoProps {
  photo: any;
  index: number;
  selected: boolean;
  onSelect: (id: number) => void;
  movePhoto: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (id: number) => void;
  isCover: boolean;
}

// 修改 Album 接口，添加 photoOrder 属性
interface Album {
  id: number;
  title: string;
  description?: string;
  customerId: number;  // 添加这个字段以修复 customerId 报错
  coverId?: number;
  photoOrder?: number[];  // 添加这个字段以支持照片排序
  photos?: any[];
  customer?: any;
}

// 单个照片组件
const DraggablePhoto: React.FC<DraggablePhotoProps> = ({ 
  photo, 
  index, 
  selected, 
  onSelect, 
  movePhoto, 
  onRemove,
  isCover
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  // 简化为不使用 useDrag/useDrop，直接用普通函数
  const isDragging = false;
  
  // 简化拖拽实现
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex !== index) {
      movePhoto(dragIndex, index);
    }
  };
  
  return (
    <div 
      className={`gallery-photo ${selected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${isCover ? 'cover' : ''}`} 
      ref={ref}
      onClick={() => onSelect(photo.id)}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="photo-img-container">
        <img 
          src={photo.thumbnailUrl || photo.url} 
          alt={photo.name}
        />
        
        {isCover && (
          <div className="cover-badge">
            <Tag color="blue">封面</Tag>
          </div>
        )}
        
        {selected && (
          <div className="photo-selected-indicator">
            <CheckCircleOutlined />
          </div>
        )}
      </div>
      
      <div className="photo-actions">
        <Button 
          type="text" 
          icon={<DeleteOutlined />}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        onRemove(photo.id);
          }}
        />
      </div>
    </div>
  );
};

const GalleryEditor: React.FC = () => {
  // 定义 TabKey 类型
  type TabKey = 'info' | 'photos' | 'customer';

  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<TabKey>('info'); // 更新为使用TabKey类型
  const [photos, setPhotos] = useState<any[]>([]);
  const [availablePhotos, setAvailablePhotos] = useState<any[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [availableLoading, setAvailableLoading] = useState(false);
  const [addPhotoModalVisible, setAddPhotoModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [sharePassword, setSharePassword] = useState('');
  
  // 初始加载
  useEffect(() => {
    if (id) {
      fetchAlbumData();
    }
  }, [id]);
  
  // 获取画册数据
  const fetchAlbumData = async () => {
    setLoading(true);
    try {
      const response = await getCustomerAlbum(parseInt(id));
      setAlbum(response.data);
      setPhotos(response.data.photos || []);
      
      form.setFieldsValue({
        title: response.data.title,
        description: response.data.description,
        isPrivate: response.data.isPrivate,
        allowDownload: response.data.allowDownload,
        allowSelect: response.data.allowSelect,
        expireDate: response.data.expireDate ? moment(response.data.expireDate) : undefined,
      });
    } catch (error) {
      console.error('获取画册信息失败:', error);
      message.error('获取画册信息失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 保存画册信息
  const handleSaveInfo = async () => {
    try {
      const values = await form.validateFields();
      
      await updateCustomerAlbum(parseInt(id), {
        ...values,
        expireDate: values.expireDate ? values.expireDate.format('YYYY-MM-DD') : null,
      });
      
      message.success('画册信息更新成功');
      fetchAlbumData();
    } catch (error) {
      console.error('保存画册信息失败:', error);
      message.error('保存画册信息失败');
    }
  };
  
  // 打开添加照片对话框
  const handleOpenAddPhotos = async () => {
    setAddPhotoModalVisible(true);
    setAvailableLoading(true);
    
    try {
      // 获取客户的所有照片（可能需要根据客户ID筛选）
      if (album) {
        const response = await getPhotos({
          customerId: album.customerId,  // 现在 album 类型中有 customerId 字段
          excludeAlbumId: parseInt(id),
        });
        
        setAvailablePhotos(response.data);
      }
    } catch (error) {
      console.error('获取可用照片失败:', error);
      message.error('获取可用照片失败');
    } finally {
      setAvailableLoading(false);
    }
  };
  
  // 添加照片到画册
  const handleAddPhotos = async () => {
    if (selectedPhotos.length === 0) {
      message.warning('请选择要添加的照片');
      return;
    }
    
    try {
      await addPhotosToCustomerAlbum(parseInt(id), selectedPhotos);
      message.success(`已添加 ${selectedPhotos.length} 张照片到画册`);
      setAddPhotoModalVisible(false);
      setSelectedPhotos([]);
      fetchAlbumData();
    } catch (error) {
      console.error('添加照片失败:', error);
      message.error('添加照片失败');
    }
  };
  
  // 从画册中移除照片
  const handleRemovePhoto = async (photoId: number) => {
    try {
      await removePhotosFromCustomerAlbum(parseInt(id), [photoId]);
      message.success('已从画册中移除该照片');
      
      // 更新本地状态
      setPhotos(photos.filter(photo => photo.id !== photoId));
    } catch (error) {
      console.error('移除照片失败:', error);
      message.error('移除照片失败');
    }
  };
  
  // 分享画册
  const handleShare = async () => {
    try {
      const response = await shareCustomerAlbum(parseInt(id));
      setShareUrl(response.data.url);
      setSharePassword(response.data.password || '');
      setShareModalVisible(true);
    } catch (error) {
      console.error('分享画册失败:', error);
      message.error('分享画册失败');
    }
  };
  
  // 移动照片位置（用于拖拽排序）
  const movePhoto = (dragIndex: number, hoverIndex: number) => {
    const dragPhoto = photos[dragIndex];
    const newPhotos = [...photos];
    newPhotos.splice(dragIndex, 1);
    newPhotos.splice(hoverIndex, 0, dragPhoto);
    setPhotos(newPhotos);
  };
  
  // 保存照片排序
  const handleSaveOrder = async () => {
    try {
      const photoIds = photos.map(photo => photo.id);
      await updateCustomerAlbum(parseInt(id), {
        ...({"photoOrder": photoIds} as any)
      });
      
      message.success('照片顺序已保存');
    } catch (error) {
      console.error('保存照片顺序失败:', error);
      message.error('保存照片顺序失败');
    }
  };
  
  // 设置封面照片
  const handleSetCover = async (photoId: number) => {
    try {
      await updateCustomerAlbum(parseInt(id), {
        coverId: photoId,
      });
      message.success('封面设置成功');
      fetchAlbumData();
    } catch (error) {
      console.error('设置封面失败:', error);
      message.error('设置封面失败');
    }
  };
  
  // 渲染基本信息表单
  const renderBasicInfoForm = () => {
    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isPrivate: true,
          allowDownload: false,
          allowSelect: true,
        }}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="title"
              label="画册标题"
              rules={[{ required: true, message: '请输入画册标题' }]}
            >
              <Input placeholder="请输入画册标题" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="themeColor"
              label="主题颜色"
            >
              <Input type="color" />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="description"
          label="画册描述"
        >
          <Input.TextArea rows={4} placeholder="请输入画册描述" />
        </Form.Item>
        
        <Form.Item
          name="expireDate"
          label="过期日期"
          extra="设置后，过期日期后客户将无法访问此画册"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item name="isPrivate" valuePropName="checked">
          <Checkbox>私密画册（需要密码访问）</Checkbox>
        </Form.Item>
        
        <Form.Item name="allowDownload" valuePropName="checked">
          <Checkbox>允许下载原图</Checkbox>
        </Form.Item>
        
        <Form.Item name="allowSelect" valuePropName="checked">
          <Checkbox>允许客户选择照片</Checkbox>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveInfo}>
            保存基本信息
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  // 渲染照片管理
  const renderPhotoManagement = () => {
    return (
      <div className="gallery-editor-photos">
        <div className="photos-header">
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAddPhotos}>
              添加照片
            </Button>
            <Button icon={<SaveOutlined />} onClick={handleSaveOrder}>
              保存排序
            </Button>
            <Button icon={<ShareAltOutlined />} onClick={handleShare}>
              分享画册
            </Button>
            <Button icon={<EyeOutlined />} onClick={() => window.open(`/preview/gallery/${id}`, '_blank')}>
              预览
            </Button>
          </Space>
          <div className="photo-count">
            共 {photos.length} 张照片
          </div>
        </div>
        
        <Divider />
        
        <div className="drag-instructions">
          <DragOutlined /> 拖拽照片可调整顺序 | 点击照片可设置为封面
        </div>
        
        <div className="gallery-photos-grid">
          {photos.length > 0 ? photos.map((photo, index) => (
            <DraggablePhoto
              key={photo.id}
              photo={photo}
              index={index}
              selected={false}
              isCover={album?.coverId === photo.id}
              onSelect={() => handleSetCover(photo.id)}
              movePhoto={movePhoto}
              onRemove={handleRemovePhoto}
            />
          )) : (
            <Empty
              description="画册还没有照片"
            />
          )}
        </div>
      </div>
    );
  };
  
  // 获取客户信息
  const renderCustomerInfo = () => {
    if (!album?.customer) return <Empty description="无关联客户信息" />;
    
    const { customer } = album;
    
    return (
      <div className="customer-info-container">
        <Descriptions title="客户信息" bordered column={1}>
          <Descriptions.Item label="姓名">{customer.name}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{customer.phone || '无'}</Descriptions.Item>
          <Descriptions.Item label="电子邮箱">{customer.email || '无'}</Descriptions.Item>
          <Descriptions.Item label="来源">{customer.source || '未知'}</Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <Space>
          <Button 
            type="primary"
            icon={<MailOutlined />}
            onClick={() => {
              history.push(`/message/send?customerId=${customer.id}&type=email`);
            }}
          >
            发送邮件
          </Button>
          <Button
            icon={<PhoneOutlined />}
            onClick={() => {
              history.push(`/message/send?customerId=${customer.id}&type=sms`);
            }}
          >
            发送短信
          </Button>
          <Button
            icon={<CreditCardOutlined />}
            onClick={() => {
              history.push(`/order/create?customerId=${customer.id}`);
            }}
          >
            创建订单
          </Button>
        </Space>
      </div>
    );
  };
  
  return (
    <div className="gallery-editor-page">
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => history.goBack()} />
            {loading ? '加载中...' : `编辑画册: ${album?.title}`}
          </Space>
        }
        loading={loading}
        className="gallery-editor-card"
      >
        <Tabs activeKey={activeTab} onChange={(key: TabKey) => setActiveTab(key)}>
          <TabPane
            tab={
              <span>
                <EditOutlined />
                基本信息
              </span>
            }
            key="info"
          >
            {renderBasicInfoForm()}
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <PictureOutlined />
                照片管理
              </span>
            }
            key="photos"
          >
            {renderPhotoManagement()}
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <UserOutlined />
                客户信息
              </span>
            }
            key="customer"
          >
            {renderCustomerInfo()}
          </TabPane>
        </Tabs>
      </Card>
      
      {/* 添加照片对话框 */}
      <Modal
        title="添加照片到画册"
        open={addPhotoModalVisible} // 修改 visible 为 open
        onCancel={() => setAddPhotoModalVisible(false)}
        onOk={handleAddPhotos}
        width={800}
        okText="添加"
        cancelText="取消"
        okButtonProps={{ disabled: selectedPhotos.length === 0 }}
      >
        <Spin spinning={availableLoading}>
          <div className="add-photos-modal">
            <div className="selection-header">
              已选择 {selectedPhotos.length} 张照片
            </div>
            
            <div className="available-photos-grid">
              {availablePhotos.length > 0 ? (
                availablePhotos.map(photo => (
                  <div
                    key={photo.id}
                    className={`available-photo ${selectedPhotos.includes(photo.id) ? 'selected' : ''}`}
                    onClick={() => {
                      if (selectedPhotos.includes(photo.id)) {
                        setSelectedPhotos(selectedPhotos.filter(id => id !== photo.id));
                      } else {
                        setSelectedPhotos([...selectedPhotos, photo.id]);
                      }
                    }}
                  >
                    <img src={photo.thumbnailUrl || photo.url} alt={photo.name} />
                    {selectedPhotos.includes(photo.id) && (
                      <div className="photo-selected-indicator">
                        <CheckCircleOutlined />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <Empty description="没有可添加的照片" />
              )}
            </div>
          </div>
        </Spin>
      </Modal>
      
      {/* 分享画册对话框 */}
      <Modal
        title="分享画册"
        open={shareModalVisible} // 修改 visible 为 open
        onCancel={() => setShareModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setShareModalVisible(false)}>
            关闭
          </Button>,
          <CopyToClipboard
            key="copy"
            text={shareUrl}
            onCopy={() => message.success('链接已复制到剪贴板')}
          >
            <Button type="primary">
              复制链接
            </Button>
          </CopyToClipboard>,
        ]}
      >
        <div className="share-info">
          <Paragraph>
            您可以将以下链接发送给客户，让他们查看画册：
          </Paragraph>
          
          <Input.TextArea
            value={shareUrl}
            rows={3}
            readOnly
            style={{ marginBottom: 16 }}
          />
          
          {sharePassword && (
            <Alert
              message={
                <Space>
                  <LockOutlined />
                  <span>访问密码: <Text strong copyable>{sharePassword}</Text></span>
                </Space>
              }
              type="info"
              style={{ marginBottom: 16 }}
            />
          )}
          
          <Paragraph>
            <Button 
              type="link" 
              icon={<MailOutlined />}
              onClick={() => {
                if (!album?.customer?.id) {
                  message.warning('该画册未关联客户，无法发送邮件');
                  return;
                }
                
                history.push({
                  pathname: '/message/send',
                  search: `?${new URLSearchParams({
                    type: 'email',
                    customerId: album.customer.id,
                    subject: `您的照片画册 - ${album.title}`,
                    content: `
                      尊敬的客户，您好：
                      
                      您的照片画册已经准备好，请点击以下链接查看：
                      ${shareUrl}
                      
                      ${sharePassword ? `访问密码: ${sharePassword}` : ''}
                      
                      谢谢您的信任与支持！
                    `
                  }).toString()}`
                });
              }}
            >
              发送邮件给客户
            </Button>
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default GalleryEditor;
