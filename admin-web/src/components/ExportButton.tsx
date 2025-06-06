import React, { useState } from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import { 
  DownloadOutlined, FileExcelOutlined, 
  FileTextOutlined, FilePdfOutlined, 
  PictureOutlined
} from '@ant-design/icons';

// 修改导入路径，使用相对路径而不是别名
import exportService, { ExportFileType, ReportType } from '../services/export';

interface ExportButtonProps {
  reportType: ReportType;
  elementId?: string;  
  customFileName?: string;
  disabled?: boolean;
  hideTypes?: ExportFileType[];
  tableData?: any[];
  tableColumns?: any[];
  filters?: Record<string, any>;
  dateRange?: [string, string];
  onStart?: () => void;
  onFinish?: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  reportType,
  elementId,
  customFileName,
  disabled = false,
  hideTypes = [],
  tableData,
  tableColumns,
  filters,
  dateRange,
  onStart,
  onFinish,
}) => {
  const [exporting, setExporting] = useState(false);
  
  // 导出参数
  const exportParams = {
    reportType,
    customFileName,
    filters,
    dateRange,
  };
  
  const handleExport = async (fileType: ExportFileType) => {
    if (exporting) return;
    
    try {
      // 调用开始回调
      if (onStart) onStart();
      setExporting(true);
      
      // 根据不同的导出类型选择不同的导出方法
      switch (fileType) {
        case ExportFileType.EXCEL:
        case ExportFileType.CSV:
          // 如果提供了表格数据和列，使用前端导出
          if (tableData && tableColumns) {
            await exportService.exportTableToExcel(tableData, tableColumns, {
              ...exportParams,
              fileType,
            });
          } else {
            // 否则使用服务器端导出
            await exportService.exportFromServer({
              ...exportParams,
              fileType,
            });
          }
          break;
          
        case ExportFileType.PDF:
          // 如果提供了元素ID，使用前端导出
          if (elementId) {
            await exportService.exportToPdf(elementId, {
              ...exportParams,
              fileType,
            });
          } else {
            // 否则使用服务器端导出
            await exportService.exportFromServer({
              ...exportParams,
              fileType,
            });
          }
          break;
          
        case ExportFileType.IMAGE:
          // 必须提供元素ID
          if (elementId) {
            await exportService.exportToImage(elementId, {
              ...exportParams,
              fileType,
            });
          } else {
            message.error('导出图片需要提供元素ID');
          }
          break;
          
        default:
          await exportService.exportFromServer({
            ...exportParams,
            fileType: ExportFileType.EXCEL,
          });
      }
    } catch (error) {
      // 错误处理
      console.error('导出失败:', error);
      message.error('导出失败，请重试');
    } finally {
      setExporting(false);
      // 调用结束回调
      if (onFinish) onFinish();
    }
  };

  // 定义可用的导出类型
  const exportTypes = [
    {
      key: ExportFileType.EXCEL,
      text: 'Excel',
      icon: <FileExcelOutlined />,
      onClick: () => handleExport(ExportFileType.EXCEL),
      hide: hideTypes.includes(ExportFileType.EXCEL),
    },
    {
      key: ExportFileType.CSV,
      text: 'CSV',
      icon: <FileTextOutlined />,
      onClick: () => handleExport(ExportFileType.CSV),
      hide: hideTypes.includes(ExportFileType.CSV),
    },
    {
      key: ExportFileType.PDF,
      text: 'PDF',
      icon: <FilePdfOutlined />,
      onClick: () => handleExport(ExportFileType.PDF),
      hide: hideTypes.includes(ExportFileType.PDF),
    },
    {
      key: ExportFileType.IMAGE,
      text: '图片',
      icon: <PictureOutlined />,
      onClick: () => handleExport(ExportFileType.IMAGE),
      hide: hideTypes.includes(ExportFileType.IMAGE) || !elementId,
    },
  ];

  // 创建下拉菜单
  const menu = (
    <Menu>
      {exportTypes
        .filter(type => !type.hide)
        .map(type => (
          <Menu.Item key={type.key} icon={type.icon} onClick={type.onClick}>
            {type.text}
          </Menu.Item>
        ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} disabled={disabled || exporting}>
      <Button 
        type="primary" 
        icon={<DownloadOutlined />} 
        loading={exporting}
        disabled={disabled}
      >
        导出
      </Button>
    </Dropdown>
  );
};

export default ExportButton;
