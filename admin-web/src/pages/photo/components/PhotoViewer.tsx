import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, Tooltip, message } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  DownloadOutlined,
  StarOutlined,
  StarFilled,
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { formatFileSize } from '../../../utils/file';
import '../PhotoLibrary.scss';

interface Photo {
  id: number;
  url: string;
  thumbnailUrl: string;
  name: string;
  size: number;
  width: number;
  height: number;
  createdAt: string;
  albumId?: number;
  albumName?: string;
  isFavorite: boolean;
  tags?: string[];
  format?: string;
}

interface PhotoViewerProps {
  visible: boolean;
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number, isFavorite: boolean) => void;
  onDownload?: (id: number) => void;
  onShare?: (id: number) => void;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({
  visible,
  photos,
  initialIndex,
  onClose,
  onDelete,
  onToggleFavorite,
  onDownload,
  onShare,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  // 重置状态，每次打开都从初始值开始
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setRotation(0);
    }
  }, [visible, initialIndex]);

  // 获取当前照片
  const currentPhoto = photos[currentIndex];

  // 前一张照片
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetTransform();
    }
  };

  // 后一张照片
  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetTransform();
    }
  };

  // 重置变换
  const resetTransform = () => {
    setScale(1);
    setRotation(0);
  };

  // 放大
  const handleZoomIn = () => {
    setScale(scale * 1.2);
  };

  // 缩小
  const handleZoomOut = () => {
    if (scale > 0.5) {
      setScale(scale / 1.2);
    }
  };

  // 向左旋转
  const handleRotateLeft = () => {
    setRotation((rotation - 90) % 360);
  };

  // 向右旋转
  const handleRotateRight = () => {
    setRotation((rotation + 90) % 360);
  };

  // 下载照片
  const handleDownload = () => {
    if (onDownload && currentPhoto) {
      onDownload(currentPhoto.id);
    } else if (currentPhoto) {
      // 默认下载行为
      const link = document.createElement('a');
      link.href = currentPhoto.url;
      link.download = currentPhoto.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = () => {
    if (onToggleFavorite && currentPhoto) {
      onToggleFavorite(currentPhoto.id, !currentPhoto.isFavorite);
    }
  };

  // 分享照片
  const handleShare = () => {
    if (onShare && currentPhoto) {
      onShare(currentPhoto.id);
    } else {
      message.info('分享功能开发中');
    }
  };

  // 删除照片
  const handleDelete = () => {
    if (onDelete && currentPhoto) {
      onDelete(currentPhoto.id);
    }
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // 如果没有照片或不可见，不渲染任何内容
  if (!visible || !currentPhoto) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      onCancel={onClose}
      width="100%"
      bodyStyle={{ padding: 0, height: 'calc(100vh - 100px)', backgroundColor: '#000' }}
      className="photo-viewer"
      wrapClassName="photo-viewer-wrapper"
      destroyOnClose
    >
      {/* 顶部工具栏 */}
      <div className="viewer-header">
        <div className="photo-info">
          <span className="photo-name">{currentPhoto.name}</span>
          <span className="photo-count">
            ({currentIndex + 1} / {photos.length})
          </span>
        </div>
        <div className="viewer-actions">
          <Space>
            <Tooltip title="信息">
              <Button
                type="text"
                icon={<InfoCircleOutlined />}
                onClick={() => setShowInfo(!showInfo)}
              />
            </Tooltip>
            <Tooltip title="下载">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
              />
            </Tooltip>
            <Tooltip title={currentPhoto.isFavorite ? "取消收藏" : "收藏"}>
              <Button
                type="text"
                icon={currentPhoto.isFavorite ? <StarFilled /> : <StarOutlined />}
                onClick={handleToggleFavorite}
              />
            </Tooltip>
            {onShare && (
              <Tooltip title="分享">
                <Button
                  type="text"
                  icon={<ShareAltOutlined />}
                  onClick={handleShare}
                />
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="删除">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                />
              </Tooltip>
            )}
            <Tooltip title="关闭">
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={onClose}
              />
            </Tooltip>
          </Space>
        </div>
      </div>

      {/* 照片区域 */}
      <div className="viewer-content">
        {/* 照片导航按钮 */}
        {currentIndex > 0 && (
          <Button
            className="nav-button prev-button"
            icon={<LeftOutlined />}
            onClick={handlePrevious}
            type="text"
          />
        )}

        {/* 照片显示区域 */}
        <div className="photo-container">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.name}
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* 照片导航按钮 */}
        {currentIndex < photos.length - 1 && (
          <Button
            className="nav-button next-button"
            icon={<RightOutlined />}
            onClick={handleNext}
            type="text"
          />
        )}

        {/* 照片信息面板 */}
        {showInfo && (
          <div className="photo-details-panel">
            <div className="panel-header">
              <h3>照片信息</h3>
              <Button type="text" icon={<CloseOutlined />} onClick={() => setShowInfo(false)} />
            </div>
            <div className="panel-content">
              <div className="detail-item">
                <span className="label">名称:</span>
                <span className="value">{currentPhoto.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">尺寸:</span>
                <span className="value">{currentPhoto.width} x {currentPhoto.height} 像素</span>
              </div>
              <div className="detail-item">
                <span className="label">大小:</span>
                <span className="value">{formatFileSize(currentPhoto.size)}</span>
              </div>
              <div className="detail-item">
                <span className="label">创建日期:</span>
                <span className="value">{formatDate(currentPhoto.createdAt)}</span>
              </div>
              {currentPhoto.albumName && (
                <div className="detail-item">
                  <span className="label">相册:</span>
                  <span className="value">{currentPhoto.albumName}</span>
                </div>
              )}
              {currentPhoto.format && (
                <div className="detail-item">
                  <span className="label">格式:</span>
                  <span className="value">{currentPhoto.format.toUpperCase()}</span>
                </div>
              )}
              {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                <div className="detail-item tags-item">
                  <span className="label">标签:</span>
                  <div className="tags-container">
                    {currentPhoto.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部工具栏 */}
      <div className="viewer-footer">
        <Space>
          <Tooltip title="缩小">
            <Button
              type="text"
              icon={<ZoomOutOutlined />}
              onClick={handleZoomOut}
            />
          </Tooltip>
          <Tooltip title="放大">
            <Button
              type="text"
              icon={<ZoomInOutlined />}
              onClick={handleZoomIn}
            />
          </Tooltip>
          <Tooltip title="向左旋转">
            <Button
              type="text"
              icon={<RotateLeftOutlined />}
              onClick={handleRotateLeft}
            />
          </Tooltip>
          <Tooltip title="向右旋转">
            <Button
              type="text"
              icon={<RotateRightOutlined />}
              onClick={handleRotateRight}
            />
          </Tooltip>
          <Tooltip title="重置">
            <Button
              type="text"
              onClick={resetTransform}
            >
              重置
            </Button>
          </Tooltip>
        </Space>
      </div>
    </Modal>
  );
};

export default PhotoViewer;
