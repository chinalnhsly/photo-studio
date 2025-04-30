import React, { useState, useEffect } from 'react';
import { Checkbox, Tooltip, Space } from 'antd';
import { 
  EyeOutlined, 
  StarOutlined, 
  StarFilled,
  CalendarOutlined,
  FileOutlined,
  DownloadOutlined
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

interface PhotoGridProps {
  photos: Photo[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
  onPreview: (index: number) => void;
  onToggleFavorite: (id: number, isFavorite: boolean) => void;
  onDownload?: (id: number) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  selectedIds,
  onSelect,
  onPreview,
  onToggleFavorite,
  onDownload
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>(selectedIds);

  // 同步外部selectedIds的变化
  useEffect(() => {
    setSelectedPhotos(selectedIds);
  }, [selectedIds]);

  // 处理照片选择/取消选择
  const handleSelect = (id: number, checked: boolean) => {
    const newSelectedPhotos = checked
      ? [...selectedPhotos, id]
      : selectedPhotos.filter(photoId => photoId !== id);
    
    setSelectedPhotos(newSelectedPhotos);
    onSelect(newSelectedPhotos);
  };

  // 处理全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    const newSelectedPhotos = checked
      ? photos.map(photo => photo.id)
      : [];
    
    setSelectedPhotos(newSelectedPhotos);
    onSelect(newSelectedPhotos);
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // 渲染单个照片项
  const renderPhotoItem = (photo: Photo, index: number) => {
    const isSelected = selectedPhotos.includes(photo.id);

    return (
      <div 
        key={photo.id} 
        className={`photo-item ${isSelected ? 'selected' : ''}`}
      >
        {/* 照片选择框 */}
        <div className="photo-select">
          <Checkbox
            checked={isSelected}
            onChange={(e: { target: { checked: boolean } }) => handleSelect(photo.id, e.target.checked)}
            onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}
          />
        </div>

        {/* 照片图片区域 */}
        <div 
          className="image-wrapper"
          onClick={() => onPreview(index)}
        >
          <img 
            src={photo.thumbnailUrl || photo.url} 
            alt={photo.name}
            loading="lazy"
          />
        </div>

        {/* 照片操作按钮 */}
        <div className="photo-actions">
          <Tooltip title="预览">
            <div 
              className="action-button" 
              onClick={(e) => {
                e.stopPropagation();
                onPreview(index);
              }}
            >
              <EyeOutlined />
            </div>
          </Tooltip>
          
          <Tooltip title={photo.isFavorite ? "取消收藏" : "收藏"}>
            <div 
              className={`action-button ${photo.isFavorite ? 'favorite' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(photo.id, !photo.isFavorite);
              }}
            >
              {photo.isFavorite ? <StarFilled /> : <StarOutlined />}
            </div>
          </Tooltip>
          
          {onDownload && (
            <Tooltip title="下载">
              <div 
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(photo.id);
                }}
              >
                <DownloadOutlined />
              </div>
            </Tooltip>
          )}
        </div>

        {/* 照片信息 */}
        <div className="photo-info">
          <div className="photo-name" title={photo.name}>
            {photo.name}
          </div>
          <div className="photo-meta">
            <div className="photo-date">
              <CalendarOutlined className="icon" />
              <span>{formatDate(photo.createdAt)}</span>
            </div>
            <div className="photo-size">
              <FileOutlined className="icon" />
              <span>{formatFileSize(photo.size)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="photo-library-container">
      <div className="photo-grid-header">
        <Checkbox
          checked={selectedPhotos.length === photos.length && photos.length > 0}
          indeterminate={selectedPhotos.length > 0 && selectedPhotos.length < photos.length}
          onChange={(e: { target: { checked: boolean } }) => handleSelectAll(e.target.checked)}
        >
          {selectedPhotos.length > 0 ? `已选择 ${selectedPhotos.length} 项` : '全选'}
        </Checkbox>
      </div>
      
      <div className="photo-grid">
        {photos.map((photo, index) => renderPhotoItem(photo, index))}
      </div>
    </div>
  );
};

export default PhotoGrid;
