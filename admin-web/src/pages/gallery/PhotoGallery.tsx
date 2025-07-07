import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Row, Col, Button, Upload, Image, Modal, Input, Select,
  Tag, Dropdown, Menu, Tooltip, message, Form, Spin, Empty
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined,
  DownloadOutlined, ShareAltOutlined, TagOutlined, FilterOutlined,
  SearchOutlined, MoreOutlined, CloudUploadOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload/interface';

import './PhotoGallery.less';

const { Option } = Select;
const { Search } = Input;

// 图片类型
interface PhotoItem {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  categoryId: number;
  tags: string[];
  photographer: string;
  shootDate: string;
  description?: string;
  uploadDate: string;
  width: number;
  height: number;
  size: number;
}

// 分类类型
interface CategoryItem {
  id: number;
  name: string;
}

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewPhoto, setPreviewPhoto] = useState<PhotoItem | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [selectMode, setSelectMode] = useState<boolean>(false);

  // 加载数据
  useEffect(() => {
    fetchPhotos();
    fetchCategories();
  }, [selectedCategory, searchText]);

  // 获取图片数据
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      
      // 实际项目中应该调用API获取数据
      // const params = {
      //   categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
      //   search: searchText || undefined,
      // };
      // const response = await api.gallery.getPhotos(params);
      // setPhotos(response.data);
      
      // 模拟API请求延迟
      setTimeout(() => {
        // 使用模拟数据
        setPhotos(mockPhotos);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('获取图片数据失败');
      setLoading(false);
    }
  };

  // 获取分类数据
  const fetchCategories = async () => {
    try {
      // 实际项目中应该调用API获取数据
      // const response = await api.gallery.getCategories();
      // setCategories(response.data);
      
      // 使用模拟数据
      setCategories(mockCategories);
    } catch (error) {
      message.error('获取分类数据失败');
    }
  };

  // 处理图片上传
  const handleUpload = async (file: File) => {
    setUploading(true);
    
    try {
      // 实际项目中应该调用API上传图片
      // const formData = new FormData();
      // formData.append('photo', file);
      // formData.append('categoryId', String(selectedCategory === 'all' ? '' : selectedCategory));
      // const response = await api.gallery.uploadPhoto(formData);
      
      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success('图片上传成功');
      fetchPhotos(); // 重新加载图片列表
    } catch (error) {
      message.error('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 处理批量图片上传
  const handleBatchUpload = async (files: File[]) => {
    setUploading(true);
    
    try {
      // 实际项目中应该调用API批量上传图片
      // const formData = new FormData();
      // files.forEach(file => {
      //   formData.append('photos', file);
      // });
      // formData.append('categoryId', String(selectedCategory === 'all' ? '' : selectedCategory));
      // const response = await api.gallery.uploadPhotoBatch(formData);
      
      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success(`成功上传${files.length}张图片`);
      fetchPhotos(); // 重新加载图片列表
    } catch (error) {
      message.error('批量上传图片失败');
    } finally {
      setUploading(false);
    }
  };

  // 处理删除图片
  const handleDeletePhoto = async (id: number) => {
    try {
      // 实际项目中应该调用API删除图片
      // await api.gallery.deletePhoto(id);
      
      message.success('图片删除成功');
      setPhotos(photos.filter(photo => photo.id !== id));
    } catch (error) {
      message.error('删除图片失败');
    }
  };

  // 处理批量删除
  const handleBatchDelete = async () => {
    if (selectedPhotos.length === 0) return;
    
    try {
      // 实际项目中应该调用API批量删除图片
      // await api.gallery.deletePhotoBatch(selectedPhotos);
      
      message.success(`成功删除${selectedPhotos.length}张图片`);
      setPhotos(photos.filter(photo => !selectedPhotos.includes(photo.id)));
      setSelectedPhotos([]);
      setSelectMode(false);
    } catch (error) {
      message.error('批量删除图片失败');
    }
  };

  // 处理预览图片
  const handlePreviewPhoto = (photo: PhotoItem) => {
    setPreviewPhoto(photo);
    setPreviewVisible(true);
  };

  // 处理查看图片详情
  const handleViewPhotoDetail = (photo: PhotoItem) => {
    setPreviewPhoto(photo);
    setDetailModalVisible(true);
  };

  // 处理编辑图片信息
  const handleEditPhoto = (photo: PhotoItem) => {
    setPreviewPhoto(photo);
    setEditModalVisible(true);
  };

  // 处理保存图片信息
  const handleSavePhotoInfo = async (values: any) => {
    if (!previewPhoto) return;
    
    try {
      // 实际项目中应该调用API更新图片信息
      // await api.gallery.updatePhoto(previewPhoto.id, values);
      
      message.success('图片信息更新成功');
      // 更新本地图片数据
      setPhotos(photos.map(photo => 
        photo.id === previewPhoto.id 
          ? { ...photo, ...values } 
          : photo
      ));
      setEditModalVisible(false);
    } catch (error) {
      message.error('更新图片信息失败');
    }
  };

  // 处理选择图片
  const handleSelectPhoto = (id: number) => {
    if (selectMode) {
      if (selectedPhotos.includes(id)) {
        setSelectedPhotos(selectedPhotos.filter(photoId => photoId !== id));
      } else {
        setSelectedPhotos([...selectedPhotos, id]);
      }
    } else {
      // 如果不是选择模式，则预览图片
      const photo = photos.find(p => p.id === id);
      if (photo) handlePreviewPhoto(photo);
    }
  };

  // 处理切换选择模式
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedPhotos([]);
    }
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map(photo => photo.id));
    }
  };

  // 获取分类名称
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '未分类';
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 渲染图片卡片
  const renderPhotoCard = (photo: PhotoItem) => {
    const isSelected = selectedPhotos.includes(photo.id);
    
    return (
      <div 
        className={`photo-card ${selectMode ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={() => handleSelectPhoto(photo.id)}
      >
        <div className="photo-card-content">
          {selectMode && (
            <div className="select-checkbox">
              <input type="checkbox" checked={isSelected} readOnly />
            </div>
          )}
          <div className="thumbnail">
            <Image
              src={photo.thumbnailUrl}
              alt={photo.title}
              preview={false}
              placeholder={<div className="image-placeholder" />}
            />
          </div>
          <div className="photo-info">
            <div className="photo-title" title={photo.title}>
              {photo.title}
            </div>
            <div className="photo-meta">
              <span>{photo.shootDate}</span>
              <span className="dot">·</span>
              <span>{getCategoryName(photo.categoryId)}</span>
            </div>
          </div>
          
          {!selectMode && (
            <div className="photo-actions">
              <Button 
                type="text" 
                icon={<EyeOutlined />} 
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handlePreviewPhoto(photo);
                }}
              />
              <Button 
                type="text" 
                icon={<InfoCircleOutlined />} 
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleViewPhotoDetail(photo);
                }}
              />
              <Button 
                type="text" 
                icon={<DownloadOutlined />} 
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  window.open(photo.url);
                }}
              />
                <Dropdown
                overlay={
                  <Menu
                  items={[
                    {
                    key: 'edit',
                    icon: <EditOutlined />,
                    label: '编辑信息',
                    onClick: () => handleEditPhoto(photo),
                    },
                    {
                    key: 'delete',
                    icon: <DeleteOutlined />,
                    label: '删除图片',
                    danger: true,
                    onClick: () => {
                      Modal.confirm({
                      title: '确认删除',
                      content: '确定要删除这张图片吗？此操作不可恢复。',
                      okText: '确认',
                      okType: 'danger',
                      cancelText: '取消',
                      onOk: () => handleDeletePhoto(photo.id),
                      });
                    },
                    },
                  ]}
                  />
                }
                trigger={['click']}
                >
                <Button 
                  type="text" 
                  icon={<MoreOutlined />} 
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
                </Dropdown>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染图片列表
  const renderPhotoList = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      );
    }
    
    if (photos.length === 0) {
      return (
        //<Empty description="暂无图片" image={(Empty as any).PRESENTED_IMAGE_DEFAULT} />
        <Empty description="暂无图片"  />
      );
    }
    
    return (
      <div className={`photo-grid ${viewMode}`}>
        <Row gutter={[16, 16]}>
          {photos.map(photo => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={photo.id}>
              {renderPhotoCard(photo)}
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // 渲染图片预览模态框
  const renderPreviewModal = () => (
    <Modal
      visible={previewVisible}
      footer={null}
      onCancel={() => setPreviewVisible(false)}
      width="auto"
      centered
      className="photo-preview-modal"
    >
      {previewPhoto && (
        <>
          <img 
            alt={previewPhoto.title} 
            src={previewPhoto.url} 
            style={{ maxWidth: '100%' }}
          />
          <div className="preview-title">
            {previewPhoto.title}
          </div>
        </>
      )}
    </Modal>
  );

  // 渲染图片详情模态框
  const renderDetailModal = () => (
    <Modal
      title="图片详情"
      visible={detailModalVisible}
      onCancel={() => setDetailModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setDetailModalVisible(false)}>
          关闭
        </Button>,
        <Button 
          key="edit" 
          type="primary" 
          onClick={() => {
            setDetailModalVisible(false);
            setEditModalVisible(true);
          }}
        >
          编辑信息
        </Button>,
      ]}
    >
      {previewPhoto && (
        <div className="photo-details">
          <div className="photo-preview">
            <img 
              src={previewPhoto.url} 
              alt={previewPhoto.title}
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
          </div>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="标题">{previewPhoto.title}</Descriptions.Item>
            <Descriptions.Item label="分类">{getCategoryName(previewPhoto.categoryId)}</Descriptions.Item>
            <Descriptions.Item label="拍摄日期">{previewPhoto.shootDate}</Descriptions.Item>
            <Descriptions.Item label="上传日期">{previewPhoto.uploadDate}</Descriptions.Item>
            <Descriptions.Item label="摄影师">{previewPhoto.photographer}</Descriptions.Item>
            <Descriptions.Item label="尺寸">{`${previewPhoto.width}×${previewPhoto.height}`}</Descriptions.Item>
            <Descriptions.Item label="大小">{formatFileSize(previewPhoto.size)}</Descriptions.Item>
            <Descriptions.Item label="标签">
              {previewPhoto.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="描述">
              {previewPhoto.description || '无描述'}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );

  // 渲染编辑图片信息模态框
  const renderEditModal = () => {
    if (!previewPhoto) return null;
    
    return (
      <Modal
        title="编辑图片信息"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={{
            title: previewPhoto.title,
            categoryId: previewPhoto.categoryId,
            photographer: previewPhoto.photographer,
            shootDate: previewPhoto.shootDate,
            tags: previewPhoto.tags,
            description: previewPhoto.description,
          }}
          onFinish={handleSavePhotoInfo}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select>
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="photographer"
            label="摄影师"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="shootDate"
            label="拍摄日期"
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="tags"
            label="标签"
          >
            <Select mode="tags" placeholder="输入标签并按回车添加" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button
                style={{ marginRight: 8 }}
                onClick={() => setEditModalVisible(false)}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // 主体内容
  return (
    <div className="photo-gallery-page">
      {/* 操作栏 */}
      <Card className="action-card">
        <div className="gallery-actions">
          <div className="left-actions">
            <Select
              value={selectedCategory}
              onChange={(value: number | 'all') => setSelectedCategory(value)}
              style={{ width: 150, marginRight: 16 }}
              placeholder="选择分类"
            >
              <Option value="all">全部分类</Option>
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
            
            <Search
              placeholder="搜索图片"
              onSearch={(value: string) => setSearchText(value)}
              style={{ width: 240 }}
              allowClear
            />
          </div>
          
          <div className="right-actions">
            <Button
              type={selectMode ? 'primary' : 'default'}
              onClick={toggleSelectMode}
              style={{ marginRight: 8 }}
            >
              {selectMode ? '退出选择' : '选择模式'}
            </Button>
            
            {selectMode ? (
              <>
                <Button
                  onClick={handleSelectAll}
                  style={{ marginRight: 8 }}
                >
                  {selectedPhotos.length === photos.length ? '取消全选' : '全选'}
                </Button>
                <Button
                  danger
                  disabled={selectedPhotos.length === 0}
                  onClick={() => {
                    Modal.confirm({
                      title: '确认删除',
                      content: `确定要删除选中的 ${selectedPhotos.length} 张图片吗？此操作不可恢复。`,
                      okText: '确认',
                      okType: 'danger',
                      cancelText: '取消',
                      onOk: handleBatchDelete,
                    });
                  }}
                >
                  删除所选
                </Button>
              </>
            ) : (
              <>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={(file: RcFile) => {
                    handleUpload(file);
                    return false;
                  }}
                >
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    loading={uploading}
                    style={{ marginRight: 8 }}
                  >
                    上传图片
                  </Button>
                </Upload>
                
                <Upload
                  accept="image/*"
                  multiple
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={(info: UploadChangeParam<UploadFile>) => {
                    if (info.fileList.length > 0) {
                      handleBatchUpload(info.fileList.map(f => f.originFileObj as File));
                    }
                    return false;
                  }}
                >
                  <Button
                    icon={<CloudUploadOutlined />}
                    loading={uploading}
                  >
                    批量上传
                  </Button>
                </Upload>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* 图片列表 */}
      <Card className="gallery-card">
        {renderPhotoList()}
      </Card>

      {/* 各种模态框 */}
      {renderPreviewModal()}
      {renderDetailModal()}
      {renderEditModal()}
    </div>
  );
};

// 导入缺失的依赖
import { Descriptions } from 'antd';

// 模拟数据
const mockCategories = [
  { id: 1, name: '婚纱照' },
  { id: 2, name: '儿童照' },
  { id: 3, name: '全家福' },
  { id: 4, name: '写真' },
  { id: 5, name: '证件照' },
];

const mockPhotos = [
  {
    id: 1,
    title: '婚纱照样片1',
    url: 'https://via.placeholder.com/800x600/FF5733/FFFFFF?text=Wedding+1',
    thumbnailUrl: 'https://via.placeholder.com/200x150/FF5733/FFFFFF?text=Wedding+1',
    categoryId: 1,
    tags: ['婚纱', '室内', '复古'],
    photographer: '张摄影',
    shootDate: '2023-03-15',
    description: '室内复古风格婚纱照',
    uploadDate: '2023-03-20',
    width: 800,
    height: 600,
    size: 1024 * 1024 * 2.5, // 2.5MB
  },
  {
    id: 2,
    title: '儿童照样片1',
    url: 'https://via.placeholder.com/800x600/33A8FF/FFFFFF?text=Kids+1',
    thumbnailUrl: 'https://via.placeholder.com/200x150/33A8FF/FFFFFF?text=Kids+1',
    categoryId: 2,
    tags: ['儿童', '外景', '活泼'],
    photographer: '李摄影',
    shootDate: '2023-04-10',
    description: '外景活泼风格儿童照',
    uploadDate: '2023-04-15',
    width: 800,
    height: 600,
    size: 1024 * 1024 * 1.8, // 1.8MB
  },
  {
    id: 3,
    title: '全家福样片1',
    url: 'https://via.placeholder.com/800x600/33FF57/FFFFFF?text=Family+1',
    thumbnailUrl: 'https://via.placeholder.com/200x150/33FF57/FFFFFF?text=Family+1',
    categoryId: 3,
    tags: ['全家福', '室内', '温馨'],
    photographer: '王摄影',
    shootDate: '2023-05-05',
    description: '室内温馨风格全家福照片',
    uploadDate: '2023-05-10',
    width: 800,
    height: 600,
    size: 1024 * 1024 * 2.1, // 2.1MB
  },
  {
    id: 4,
    title: '写真样片1',
    url: 'https://via.placeholder.com/800x600/A833FF/FFFFFF?text=Portrait+1',
    thumbnailUrl: 'https://via.placeholder.com/200x150/A833FF/FFFFFF?text=Portrait+1',
    categoryId: 4,
    tags: ['写真', '外景', '时尚'],
    photographer: '赵摄影',
    shootDate: '2023-06-20',
    description: '外景时尚风格人像写真',
    uploadDate: '2023-06-25',
    width: 800,
    height: 600,
    size: 1024 * 1024 * 1.5, // 1.5MB
  },
  {
    id: 5,
    title: '证件照样片1',
    url: 'https://via.placeholder.com/800x600/FF33A8/FFFFFF?text=ID+Photo+1',
    thumbnailUrl: 'https://via.placeholder.com/200x150/FF33A8/FFFFFF?text=ID+Photo+1',
    categoryId: 5,
    tags: ['证件照', '室内', '正式'],
    photographer: '张摄影',
    shootDate: '2023-07-01',
    description: '正式场合使用的证件照',
    uploadDate: '2023-07-01',
    width: 800,
    height: 600,
    size: 1024 * 512, // 0.5MB
  },
  {
    id: 6,
    title: '婚纱照样片2',
    url: 'https://via.placeholder.com/800x600/F4D03F/FFFFFF?text=Wedding+2',
    thumbnailUrl: 'https://via.placeholder.com/200x150/F4D03F/FFFFFF?text=Wedding+2',
    categoryId: 1,
    tags: ['婚纱', '外景', '海边'],
    photographer: '李摄影',
    shootDate: '2023-03-18',
    description: '海边婚纱照',
    uploadDate: '2023-03-25',
    width: 800,
    height: 600,
    size: 1024 * 1024 * 3.2, // 3.2MB
  },
];

export default PhotoGallery;
