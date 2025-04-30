import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Input,
  Upload,
  Modal,
  message,
  Dropdown,
  Menu,
  Space,
  Divider,
  Tooltip,
  Empty,
  Badge,
  Spin,
  Alert,
  Typography,
  Tag,
  Radio,
} from 'antd';
import type { UploadFile } from 'antd/lib/upload/interface';
import type { RcFile } from 'antd/lib/upload';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import {
  SearchOutlined,
  UploadOutlined,
  FolderAddOutlined,
  DeleteOutlined,
  EditOutlined,
  CloudUploadOutlined,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  SendOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  PictureFilled,
  FolderFilled,
  CalendarOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  getPhotoAlbums,
  getPhotos,
  createPhotoAlbum,
  updatePhotoAlbum,
  deletePhotoAlbum,
  uploadPhotos,
  deletePhotos,
  updatePhoto,
  sharePhotos,
} from '../../services/photo';
import PhotoGrid from './components/PhotoGrid';
import PhotoViewer from './components/PhotoViewer';
import FolderList from './components/FolderList';
import './PhotoLibrary.scss';
import Dragger from 'antd/lib/upload/Dragger';
const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;


// 文件夹创建/编辑表单接口
interface FolderFormData {
  name: string;
  description?: string;
  parentId?: number | null;
  isPublic?: boolean;
}

const PhotoLibrary: React.FC = () => {
  // 状态
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentAlbum, setCurrentAlbum] = useState<any | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [sorting, setSorting] = useState<string>('newest');
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [folderFormData, setFolderFormData] = useState<FolderFormData>({ name: '' });
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([]);
  
  const uploadRef = useRef<any>();

  // 初始化加载数据
  useEffect(() => {
    fetchAlbums();
  }, []);
  
  // 当选择相册时加载照片
  useEffect(() => {
    if (currentAlbum) {
      fetchPhotos(currentAlbum.id);
    } else {
      fetchPhotos(); // 加载所有照片
    }
  }, [currentAlbum, sorting]);
  
  // 获取相册列表
  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const response = await getPhotoAlbums();
      setAlbums(response.data);
    } catch (error) {
      console.error('获取相册列表失败:', error);
      message.error('获取相册列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 获取照片列表
  const fetchPhotos = async (albumId?: number) => {
    setLoading(true);
    try {
      const response = await getPhotos({
        albumId,
        search: searchValue,
        sort: sorting,
      });
      setPhotos(response.data);
    } catch (error) {
      console.error('获取照片列表失败:', error);
      message.error('获取照片列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 创建相册
  const handleCreateAlbum = async () => {
    try {
      const response = await createPhotoAlbum(folderFormData);
      message.success('相册创建成功');
      setFolderModalVisible(false);
      setFolderFormData({ name: '' });
      
      // 刷新相册列表
      await fetchAlbums();
      
      // 如果设置了父相册，则更新当前相册
      if (folderFormData.parentId && currentAlbum?.id === folderFormData.parentId) {
        fetchPhotos(currentAlbum.id);
      }
    } catch (error) {
      console.error('创建相册失败:', error);
      message.error('创建相册失败');
    }
  };
  
  // 编辑相册
  const handleEditAlbum = async () => {
    if (!editingFolderId) return;
    
    try {
      await updatePhotoAlbum(editingFolderId, folderFormData);
      message.success('相册更新成功');
      setFolderModalVisible(false);
      setEditingFolderId(null);
      setFolderFormData({ name: '' });
      
      // 刷新相册列表
      await fetchAlbums();
      
      // 如果当前正在查看被编辑的相册，更新当前相册信息
      if (currentAlbum?.id === editingFolderId) {
        const updatedAlbum = albums.find(album => album.id === editingFolderId);
        if (updatedAlbum) {
          setCurrentAlbum({
            ...currentAlbum,
            name: folderFormData.name,
            description: folderFormData.description,
          });
        }
      }
    } catch (error) {
      console.error('更新相册失败:', error);
      message.error('更新相册失败');
    }
  };
  
  // 删除相册
  const handleDeleteAlbum = async (albumId: number) => {
    try {
      await deletePhotoAlbum(albumId);
      message.success('相册删除成功');
      
      // 刷新相册列表
      await fetchAlbums();
      
      // 如果当前正在查看被删除的相册，重置当前相册
      if (currentAlbum?.id === albumId) {
        setCurrentAlbum(null);
      }
    } catch (error) {
      console.error('删除相册失败:', error);
      message.error('删除相册失败');
    }
  };
  
  // 删除选中的照片
  const handleDeletePhotos = async () => {
    try {
      await deletePhotos(selectedPhotos);
      message.success(`已删除 ${selectedPhotos.length} 张照片`);
      setSelectedPhotos([]);
      
      // 刷新照片列表
      if (currentAlbum) {
        fetchPhotos(currentAlbum.id);
      } else {
        fetchPhotos();
      }
    } catch (error) {
      console.error('删除照片失败:', error);
      message.error('删除照片失败');
    }
  };
  
  // 上传照片
  const handleUploadPhotos = async () => {
    if (uploadingFiles.length === 0) {
      message.warning('请先选择要上传的照片');
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      
      // 添加相册ID到表单
      if (currentAlbum) {
        formData.append('albumId', currentAlbum.id.toString());
      }
      
      // 添加文件到表单
      uploadingFiles.forEach(file => {
        formData.append('photos', file.originFileObj);
      });
      
      await uploadPhotos(formData);
      message.success('照片上传成功');
      
      // 关闭上传对话框
      setUploadModalVisible(false);
      setUploadingFiles([]);
      
      // 刷新照片列表
      if (currentAlbum) {
        fetchPhotos(currentAlbum.id);
      } else {
        fetchPhotos();
      }
    } catch (error) {
      console.error('上传照片失败:', error);
      message.error('上传照片失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 收藏/取消收藏照片
  const handleToggleFavorite = async (photoId: number, isFavorite: boolean) => {
    try {
      await updatePhoto(photoId, { isFavorite });
      
      // 更新本地状态
      setPhotos(prevPhotos => prevPhotos.map(photo => 
        photo.id === photoId ? { ...photo, isFavorite } : photo
      ));
      
      message.success(isFavorite ? '已添加到收藏' : '已取消收藏');
    } catch (error) {
      console.error('更新收藏状态失败:', error);
      message.error('操作失败');
    }
  };
  
  // 分享照片
  const handleSharePhotos = async () => {
    try {
      const response = await sharePhotos(selectedPhotos);
      
      Modal.success({
        title: '分享链接已创建',
        content: (
          <div>
            <p>分享链接有效期为7天，客户可以通过该链接查看和下载照片。</p>
            <Input.TextArea 
              value={response.data.url} 
              readOnly 
              rows={3} 
              style={{ marginTop: 16 }}
            />
          </div>
        ),
      });
    } catch (error) {
      console.error('创建分享链接失败:', error);
      message.error('分享失败');
    }
  };
  
  // 预览照片
  const handlePreviewPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
    setViewerVisible(true);
  };
  
  // 打开相册创建对话框
  const showCreateAlbumModal = () => {
    setFolderFormData({ 
      name: '',
      parentId: currentAlbum?.id || null,
      isPublic: false,
    });
    setEditingFolderId(null);
    setFolderModalVisible(true);
  };
  
  // 打开相册编辑对话框
  const showEditAlbumModal = (album: any) => {
    setFolderFormData({
      name: album.name,
      description: album.description,
      parentId: album.parentId,
      isPublic: album.isPublic,
    });
    setEditingFolderId(album.id);
    setFolderModalVisible(true);
  };
  
  // 选择照片
  const handleSelectPhotos = (photoIds: number[]) => {
    setSelectedPhotos(photoIds);
  };
  
  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (currentAlbum) {
      fetchPhotos(currentAlbum.id);
    } else {
      fetchPhotos();
    }
  };
  
  // 渲染批量操作按钮
  const renderBatchActions = () => {
    if (selectedPhotos.length === 0) return null;
    
    return (
      <div className="batch-actions">
        <Space>
          <Button 
            icon={<SendOutlined />}
            onClick={() => message.info('发送给客户功能开发中')}
          >
            发送给客户
          </Button>
          <Button 
            icon={<ShareAltOutlined />}
            onClick={handleSharePhotos}
          >
            创建分享链接
          </Button>
          <Button 
            icon={<DownloadOutlined />}
            onClick={() => message.info('批量下载功能开发中')}
          >
            下载
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeletePhotos}
          >
            删除
          </Button>
        </Space>
        <span className="selected-count">
          已选择 {selectedPhotos.length} 张照片
        </span>
      </div>
    );
  };

  return (
    <div className="photo-library-page">
      <Row gutter={24}>
        {/* 左侧相册列表 */}
        <Col xs={24} md={6} className="folder-section">
          <Card className="folder-card" title="我的相册">
            <div className="folder-actions">
              <Button 
                type="primary" 
                icon={<FolderAddOutlined />}
                onClick={showCreateAlbumModal}
              >
                新建相册
              </Button>
            </div>
            <Divider />
            <FolderList
              folders={albums}
              currentFolder={currentAlbum}
              onSelectFolder={setCurrentAlbum}
              onEditFolder={showEditAlbumModal}
              onDeleteFolder={handleDeleteAlbum}
            />
          </Card>
        </Col>

        {/* 右侧照片区域 */}
        <Col xs={24} md={18} className="photo-section">
          <Card className="photo-card">
            {/* 照片功能区 */}
            <div className="photo-header">
              <div className="current-path">
                <Space>
                  {currentAlbum ? (
                    <>
                      <FolderFilled />
                      <span className="album-name">{currentAlbum.name}</span>
                      <span className="photo-count">({photos.length} 张照片)</span>
                      {currentAlbum.isPublic && <Tag color="green">公开</Tag>}
                    </>
                  ) : (
                    <>
                      <PictureFilled />
                      <span className="album-name">全部照片</span>
                      <span className="photo-count">({photos.length} 张照片)</span>
                    </>
                  )}
                </Space>
              </div>
              <div className="photo-actions">
                <Search
                  placeholder="搜索照片"
                  allowClear
                  onSearch={handleSearch}
                  style={{ width: 200, marginRight: 8 }}
                />
                <Select
                  defaultValue="newest"
                  style={{ width: 120, marginRight: 8 }}
                  onChange={(value: string) => setSorting(value)}
                >
                  <Option value="newest">最新上传</Option>
                  <Option value="oldest">最早上传</Option>
                  <Option value="name_asc">名称升序</Option>
                  <Option value="name_desc">名称降序</Option>
                  <Option value="size_asc">大小升序</Option>
                  <Option value="size_desc">大小降序</Option>
                </Select>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setUploadModalVisible(true)}
                >
                  上传照片
                </Button>
              </div>
            </div>

            <Divider />

            {/* 批量操作区域 */}
            {renderBatchActions()}

            {/* 照片网格区域 */}
            <Spin spinning={loading}>
              {photos.length > 0 ? (
                <PhotoGrid
                  photos={photos}
                  onSelect={handleSelectPhotos}
                  selectedIds={selectedPhotos}
                  onPreview={handlePreviewPhoto}
                  onToggleFavorite={handleToggleFavorite}
                />
              ) : (
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  description={
                    <span>
                      {currentAlbum
                        ? '该相册还没有照片'
                        : '还没有上传过照片'}
                    </span>
                  }
                >
                  <Button 
                    type="primary" 
                    icon={<UploadOutlined />}
                    onClick={() => setUploadModalVisible(true)}
                  >
                    上传照片
                  </Button>
                </Empty>
              )}
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* 照片预览器 */}
      <PhotoViewer
        visible={viewerVisible}
        photos={photos}
        initialIndex={currentPhotoIndex}
        onClose={() => setViewerVisible(false)}
      />

      {/* 创建/编辑相册对话框 */}
      <Modal
        title={editingFolderId ? '编辑相册' : '创建相册'}
        visible={folderModalVisible}
        onOk={editingFolderId ? handleEditAlbum : handleCreateAlbum}
        onCancel={() => setFolderModalVisible(false)}
      >
        <div className="folder-form">
          <div className="form-item">
            <div className="form-label">相册名称</div>
            <Input
              placeholder="请输入相册名称"
              value={folderFormData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFolderFormData({ ...folderFormData, name: e.target.value })}
              maxLength={50}
            />
          </div>
          <div className="form-item">
            <div className="form-label">相册描述</div>
            <Input.TextArea
              placeholder="请输入相册描述（可选）"
              value={folderFormData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFolderFormData({ ...folderFormData, description: e.target.value })}
              maxLength={200}
              rows={3}
            />
          </div>
          <div className="form-item">
            <div className="form-label">父相册</div>
            <Select
              placeholder="请选择父相册（可选）"
              style={{ width: '100%' }}
              value={folderFormData.parentId}
              onChange={(value: number | null) => setFolderFormData({ ...folderFormData, parentId: value })}
              allowClear
            >
              {albums.map(album => (
                <Option key={album.id} value={album.id}>{album.name}</Option>
              ))}
            </Select>
          </div>
          <div className="form-item">
            <div className="form-label">
              <Space>
                是否公开
                <Tooltip title="公开相册可以被客户查看">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            </div>
            <Radio.Group
              value={folderFormData.isPublic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFolderFormData({ ...folderFormData, isPublic: e.target.checked })}
            >
              <Radio value={true}>公开</Radio>
              <Radio value={false}>私密</Radio>
            </Radio.Group>
          </div>
        </div>
      </Modal>

      {/* 上传照片对话框 */}
      <Modal
        title="上传照片"
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onOk={handleUploadPhotos}
        okText="开始上传"
        cancelText="取消"
        width={700}
      >
        <div className="upload-form">
          <Alert
            message="上传说明"
            description="您可以一次选择多张照片进行上传。支持JPG、PNG、HEIC格式，每张照片大小不超过20MB。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <div className="upload-destination">
            <Text>上传至：</Text>
            <Select
              value={currentAlbum?.id || 'root'}
              style={{ width: 200, marginLeft: 8 }}
              onChange={(value: string | number) => {
                if (value === 'root') {
                  setCurrentAlbum(null);
                } else {
                  const album = albums.find(a => a.id === value);
                  if (album) setCurrentAlbum(album);
                }
              }}
            >
              <Option value="root">全部照片</Option>
              {albums.map(album => (
                <Option key={album.id} value={album.id}>{album.name}</Option>
              ))}
            </Select>
          </div>
          
          <Dragger
            multiple
            fileList={uploadingFiles}
            beforeUpload={(file: File) => {
              // 在这里你可以添加文件验证逻辑
              const isValidFormat = ['image/jpeg', 'image/png', 'image/heic'].includes(file.type);
              const isLessThan20M = file.size / 1024 / 1024 < 20;
              
              if (!isValidFormat) {
                message.error('只能上传JPG/PNG/HEIC格式的图片!');
              }
              
              if (!isLessThan20M) {
                message.error('图片大小不能超过20MB!');
              }
              
              return isValidFormat && isLessThan20M;
            }}
            onChange={({ fileList }: { fileList: UploadFile[] }) => setUploadingFiles(fileList)}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => {
              console.log('Dropped files', e.dataTransfer.files);
            }}
            customRequest={(options: UploadRequestOption<any>) => {
              const { file, onSuccess } = options;
              // 模拟上传成功
              setTimeout(() => {
                onSuccess?.('ok');
              }, 0);
            }}
          >
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单次或批量上传
            </p>
          </Dragger>
        </div>
      </Modal>
    </div>
  );
};

export default PhotoLibrary;
