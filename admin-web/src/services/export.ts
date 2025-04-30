import { message } from 'antd';
// 修正导入路径
import request from '../utils/request';

// 导出格式类型
export enum ExportFileType {
  EXCEL = 'excel',
  CSV = 'csv',
  PDF = 'pdf',
  IMAGE = 'image'
}

// 报表类型
export enum ReportType {
  SALES = 'sales',           // 销售报表
  CUSTOMER = 'customer',     // 客户报表
  BOOKING = 'booking',       // 预约报表
  PHOTOGRAPHER = 'photographer', // 摄影师业绩报表
  PRODUCT = 'product'        // 产品销售报表
}

// 导出参数接口
interface ExportParams {
  reportType: ReportType;
  fileType: ExportFileType;
  dateRange?: [string, string];
  filters?: Record<string, any>;
  customFileName?: string;
}

// 简易封装函数，用于在缺少依赖时显示提示
const showMissingDependencyError = (dependencyName: string) => {
  message.warning(`缺少依赖库 ${dependencyName}，请安装后重试`);
  return Promise.resolve();
};

// 报表服务
const exportService = {
  // 通过API导出报表
  async exportFromServer(params: ExportParams): Promise<void> {
    message.info('正在使用模拟导出功能，实际项目中应调用API');
    await new Promise(resolve => setTimeout(resolve, 2000));
    message.success('导出成功');
    return Promise.resolve();
  },
  
  // 前端导出Excel/CSV
  async exportTableToExcel(tableData: any[], columns: any[], params: ExportParams): Promise<void> {
    message.info('正在使用模拟导出功能，实际项目中应使用xlsx库');
    await new Promise(resolve => setTimeout(resolve, 2000));
    message.success('导出成功');
    return Promise.resolve();
  },
  
  // 导出元素为PDF
  async exportToPdf(elementId: string, params: ExportParams): Promise<void> {
    message.info('正在使用模拟导出功能，实际项目中应使用html2canvas和jspdf库');
    await new Promise(resolve => setTimeout(resolve, 2000));
    message.success('导出成功');
    return Promise.resolve();
  },
  
  // 导出为图片
  async exportToImage(elementId: string, params: ExportParams): Promise<void> {
    message.info('正在使用模拟导出功能，实际项目中应使用html2canvas库');
    await new Promise(resolve => setTimeout(resolve, 2000));
    message.success('导出成功');
    return Promise.resolve();
  }
};

export default exportService;
