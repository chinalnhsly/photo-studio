import React, { useState } from 'react';
import { Tooltip, Popconfirm } from 'antd';
import { 
  FolderOutlined, 
  FolderOpenOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PictureFilled,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import '../PhotoLibrary.scss';

interface Folder {
  id: number;
  name: string;
  parentId?: number;
  photoCount: number;
  subFolders?: Folder[];
  isPublic?: boolean;
}

interface FolderListProps {
  folders: Folder[];
  currentFolder: Folder | null;
  onSelectFolder: (folder: Folder | null) => void;
  onEditFolder?: (folder: Folder) => void;
  onDeleteFolder?: (folderId: number) => void;
}

const FolderList: React.FC<FolderListProps> = ({
  folders,
  currentFolder,
  onSelectFolder,
  onEditFolder,
  onDeleteFolder
}) => {
  const [expandedFolderIds, setExpandedFolderIds] = useState<number[]>([]);

  // 处理展开/折叠逻辑
  const toggleExpand = (folderId: number) => {
    if (expandedFolderIds.includes(folderId)) {
      setExpandedFolderIds(expandedFolderIds.filter(id => id !== folderId));
    } else {
      setExpandedFolderIds([...expandedFolderIds, folderId]);
    }
  };

  // 递归渲染文件夹树
  const renderFolderTree = (folders: Folder[], level = 0) => {
    return folders.map(folder => {
      const hasSubFolders = folder.subFolders && folder.subFolders.length > 0;
      const isExpanded = expandedFolderIds.includes(folder.id);
      const isSelected = currentFolder?.id === folder.id;
      
      return (
        <div key={folder.id} style={{ paddingLeft: `${level * 16}px` }}>
          <div 
            className={`folder-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectFolder(folder)}
          >
            <div className="folder-info">
              {hasSubFolders ? (
                <span 
                  className="expand-icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(folder.id);
                  }}
                >
                  {isExpanded ? '▼' : '►'}
                </span>
              ) : (
                <span className="expand-placeholder"></span>
              )}
              <span className="folder-icon">
                {isSelected ? <FolderOpenOutlined /> : <FolderOutlined />}
              </span>
              <span className="folder-name">
                {folder.name}
              </span>
              <span className="folder-count">
                ({folder.photoCount})
              </span>
              {folder.isPublic && (
                <Tooltip title="公开相册">
                  <UnlockOutlined style={{ marginLeft: 8, color: '#52c41a' }} />
                </Tooltip>
              )}
            </div>
            <div className="folder-actions">
              {onEditFolder && (
                <Tooltip title="编辑相册">
                  <EditOutlined
                    className="action-button"
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                      e.stopPropagation();
                      onEditFolder(folder);
                    }}
                  />
                </Tooltip>
              )}
              {onDeleteFolder && (
                <Popconfirm
                  title={
                    <div>
                      确定要删除此相册吗?
                      <div style={{ fontSize: "12px", marginTop: "4px" }}>
                        删除后所有照片将移至未分类区域
                      </div>
                    </div>
                  }
                  onConfirm={(e: React.MouseEvent<HTMLElement, MouseEvent>)=> {
                    e?.stopPropagation();
                    onDeleteFolder(folder.id);
                  }}
                  onCancel={(e: React.MouseEvent<HTMLElement, MouseEvent>) => e?.stopPropagation()}
                  okText="确定"
                  cancelText="取消"
                >
                  <Tooltip title="删除相册">
                    <DeleteOutlined
                      className="action-button delete-button"
                      onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>)=> e.stopPropagation()}
                    />
                  </Tooltip>
                </Popconfirm>
              )}
            </div>
          </div>
          
          {/* 递归渲染子文件夹 */}
          {hasSubFolders && isExpanded && renderFolderTree(folder.subFolders!, level + 1)}
        </div>
      );
    });
  };

  // 计算所有照片数量
  const totalPhotos = folders.reduce((sum, folder) => sum + folder.photoCount, 0);

  return (
    <div className="folder-list">
      {/* 所有照片项 */}
      <div 
        className={`folder-item ${!currentFolder ? 'selected' : ''}`}
        onClick={() => onSelectFolder(null)}
      >
        <div className="folder-info">
          <span className="folder-icon">
            <PictureFilled style={{ color: '#1890ff' }} />
          </span>
          <span className="folder-name">全部照片</span>
          <span className="folder-count">({totalPhotos})</span>
        </div>
      </div>
      
      {/* 收藏夹 */}
      <div 
        className="folder-item"
        onClick={() => {
          // 处理收藏夹逻辑
        }}
      >
        <div className="folder-info">
          <span className="folder-icon" style={{ color: '#f5222d' }}>
            ★
          </span>
          <span className="folder-name">收藏</span>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="folder-separator"></div>

      {/* 相册树 */}
      {renderFolderTree(folders)}

    
    </div>
  );
};

export default FolderList;
