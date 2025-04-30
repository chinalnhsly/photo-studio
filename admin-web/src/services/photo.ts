import { message } from 'antd';
import request from '../utils/request';

// 类型定义
interface Album {
  id: number;
  title: string;
  description?: string;
  customerId: number;
  coverId?: number;
  isPrivate: boolean;
  allowDownload: boolean;
  allowSelect: boolean;
  expireDate?: string;
  themeColor?: string;
  photos?: any[];
  customer?: any;
}

interface PhotoSearchParams {
  customerId?: number;
  excludeAlbumId?: number;
  categoryId?: number;
  keyword?: string;
  albumId?: number;
  search?: string;
  sort?: string;
  tags?: string[];
  favorite?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// 分享链接接口定义
export interface ShareLinkData {
  id: string;
  code?: string;
  type: 'photo' | 'album';
  resourceId: number;
  resourceName?: string;
  title?: string;
  url: string;
  createdAt: string;
  expiresAt: string | null;
  hasPassword: boolean;
  password?: string;
  viewCount: number;
  downloadCount: number;
  allowDownload: boolean;
  allowComment?: boolean;
  photoCount?: number;
}

export interface CreateShareLinkParams {
  type: 'photo' | 'album';
  resourceId: number;
  expireDays?: number;
  password?: string;
  allowDownload?: boolean;
  allowComment?: boolean;
  title?: string;
}

export interface UpdateShareLinkParams {
  expireDays?: number;
  password?: string | null;
  isActive?: boolean;
  allowDownload?: boolean;
  allowComment?: boolean;
}

// 获取客户相册
export async function getCustomerAlbum(id: number): Promise<{ data: Album }> {
  try {
    const mockAlbum: Album = {
      id,
      title: '婚纱照精选',
      description: '2023年5月15日拍摄的婚纱照精选集',
      customerId: 101,
      coverId: 1001,
      isPrivate: true,
      allowDownload: false,
      allowSelect: true,
      themeColor: '#ff5c5c',
      photos: [
        { id: 1001, name: '照片1', url: 'https://via.placeholder.com/500/FF5733/FFFFFF?text=Photo+1', thumbnailUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Photo+1' },
        { id: 1002, name: '照片2', url: 'https://via.placeholder.com/500/33A8FF/FFFFFF?text=Photo+2', thumbnailUrl: 'https://via.placeholder.com/150/33A8FF/FFFFFF?text=Photo+2' },
        { id: 1003, name: '照片3', url: 'https://via.placeholder.com/500/33FF57/FFFFFF?text=Photo+3', thumbnailUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Photo+3' },
      ],
      customer: {
        id: 101,
        name: '张三',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        source: '官网'
      }
    };
    
    return { data: mockAlbum };
  } catch (error) {
    message.error('获取相册信息失败');
    throw error;
  }
}

// 更新客户相册
export async function updateCustomerAlbum(id: number, data: Partial<Album>): Promise<any> {
  try {
    return { success: true };
  } catch (error) {
    message.error('更新相册信息失败');
    throw error;
  }
}

// 添加照片到相册
export async function addPhotosToCustomerAlbum(albumId: number, photoIds: number[]): Promise<any> {
  try {
    return { success: true };
  } catch (error) {
    message.error('添加照片失败');
    throw error;
  }
}

// 从相册移除照片
export async function removePhotosFromCustomerAlbum(albumId: number, photoIds: number[]): Promise<any> {
  try {
    return { success: true };
  } catch (error) {
    message.error('移除照片失败');
    throw error;
  }
}

// 分享相册
export async function shareCustomerAlbum(albumId: number): Promise<{ data: { url: string; password?: string } }> {
  try {
    return {
      data: {
        url: `https://example.com/view/gallery/${albumId}?token=xyz123`,
        password: '123456'
      }
    };
  } catch (error) {
    message.error('分享相册失败');
    throw error;
  }
}

// 获取照片列表
export async function getPhotos(params: PhotoSearchParams = {}): Promise<{ data: any[] }> {
  try {
    const mockPhotos = [
      { id: 2001, name: '可用照片1', url: 'https://via.placeholder.com/500/A833FF/FFFFFF?text=Available+1', thumbnailUrl: 'https://via.placeholder.com/150/A833FF/FFFFFF?text=Available+1' },
      { id: 2002, name: '可用照片2', url: 'https://via.placeholder.com/500/FF33A8/FFFFFF?text=Available+2', thumbnailUrl: 'https://via.placeholder.com/150/FF33A8/FFFFFF?text=Available+2' },
      { id: 2003, name: '可用照片3', url: 'https://via.placeholder.com/500/33FFA8/FFFFFF?text=Available+3', thumbnailUrl: 'https://via.placeholder.com/150/33FFA8/FFFFFF?text=Available+3' },
      { id: 2004, name: '可用照片4', url: 'https://via.placeholder.com/500/A8FF33/FFFFFF?text=Available+4', thumbnailUrl: 'https://via.placeholder.com/150/A8FF33/FFFFFF?text=Available+4' },
    ];
    
    return { data: mockPhotos };
  } catch (error) {
    message.error('获取照片列表失败');
    throw error;
  }
}

// 获取照片分享链接
export async function getPhotoShareLinks(params?: any): Promise<{
  success: boolean;
  data: ShareLinkData[];
}> {
  try {
    return request.get('/api/photos/shares', { params }) as unknown as Promise<{
      success: boolean;
      data: ShareLinkData[];
    }>;
  } catch (error) {
    message.error('获取分享链接失败');
    throw error;
  }
}

/**
 * 创建分享链接
 * @param data 分享链接数据
 * @returns 返回创建结果
 */
export async function createShareLink(data: CreateShareLinkParams): Promise<{
  success: boolean;
  data: ShareLinkData;
}> {
  try {
    return request.post('/api/photos/shares', data) as unknown as Promise<{
      success: boolean;
      data: ShareLinkData;
    }>;
  } catch (error) {
    message.error('创建分享链接失败');
    throw error;
  }
}

/**
 * 更新分享链接
 * @param id 分享链接ID
 * @param data 更新数据
 * @returns 返回更新结果
 */
export async function updateShareLink(id: string, data: UpdateShareLinkParams): Promise<{
  success: boolean;
  data: ShareLinkData;
}> {
  try {
    return request.put(`/api/photos/shares/${id}`, data) as unknown as Promise<{
      success: boolean;
      data: ShareLinkData;
    }>;
  } catch (error) {
    message.error('更新分享链接失败');
    throw error;
  }
}

// 删除分享链接
export async function deletePhotoShareLink(id: string): Promise<{
  success: boolean;
}> {
  try {
    return request.delete(`/api/photos/shares/${id}`) as unknown as Promise<{
      success: boolean;
    }>;
  } catch (error) {
    message.error('删除分享链接失败');
    throw error;
  }
}

/**
 * 延长分享链接有效期
 * @param id 分享链接ID
 * @param days 延长天数
 * @returns 返回更新结果
 */
export async function extendShareExpiration(id: string, days: number): Promise<{
  success: boolean;
  data: ShareLinkData;
}> {
  try {
    return request.post(`/api/photos/shares/${id}/extend`, { days }) as unknown as Promise<{
      success: boolean;
      data: ShareLinkData;
    }>;
  } catch (error) {
    message.error('延长有效期失败');
    throw error;
  }
}

/**
 * 获取分享链接详情
 * @param code 分享链接代码
 * @param password 访问密码
 * @returns 返回分享链接详情
 */
export async function getShareLinkByCode(code: string, password?: string): Promise<{
  success: boolean;
  data: ShareLinkData & {
    resources: any[];
  };
}> {
  try {
    return request.get(`/api/share/${code}`, { 
      params: password ? { password } : {} 
    }) as unknown as Promise<{
      success: boolean;
      data: ShareLinkData & {
        resources: any[];
      };
    }>;
  } catch (error) {
    message.error('获取分享内容失败');
    throw error;
  }
}

/**
 * 验证分享链接密码
 * @param code 分享链接代码
 * @param password 访问密码
 * @returns 返回验证结果
 */
export async function verifySharePassword(code: string, password: string): Promise<{
  success: boolean;
  data: {
    valid: boolean;
    token?: string;
  };
}> {
  try {
    return request.post(`/api/share/${code}/verify`, { password }) as unknown as Promise<{
      success: boolean;
      data: {
        valid: boolean;
        token?: string;
      };
    }>;
  } catch (error) {
    message.error('验证密码失败');
    throw error;
  }
}

/**
 * 记录分享链接访问
 * @param code 分享链接代码
 * @returns 返回记录结果
 */
export async function recordShareAccess(code: string): Promise<{
  success: boolean;
}> {
  try {
    return request.post(`/api/share/${code}/access`) as unknown as Promise<{
      success: boolean;
    }>;
  } catch (error) {
    console.error('记录访问失败:', error);
    return { success: false };
  }
}

/**
 * 记录分享内容下载
 * @param code 分享链接代码
 * @param resourceId 资源ID（照片ID或相册ID）
 * @returns 返回记录结果
 */
export async function recordShareDownload(code: string, resourceId: number): Promise<{
  success: boolean;
}> {
  try {
    return request.post(`/api/share/${code}/download`, { resourceId }) as unknown as Promise<{
      success: boolean;
    }>;
  } catch (error) {
    console.error('记录下载失败:', error);
    return { success: false };
  }
}

// 验证照片分享密码
export async function verifyPhotoSharePassword(shareId: string, password: string) {
  try {
    const isValid = password === '123456';
    return { 
      success: isValid,
      data: {
        valid: isValid,
        token: isValid ? 'valid-token-xyz' : undefined
      }
    };
  } catch (error) {
    message.error('验证分享密码失败');
    throw error;
  }
}

// 获取相册列表
export async function getPhotoAlbums(): Promise<{ data: any[] }> {
  try {
    const mockAlbums = [
      {
        id: 1,
        name: '婚纱照',
        description: '婚纱照相册',
        photoCount: 25,
        isPublic: true,
        createdAt: '2023-05-10',
        subFolders: [
          {
            id: 3,
            name: '室内照',
            parentId: 1,
            photoCount: 10,
            createdAt: '2023-05-12'
          },
          {
            id: 4,
            name: '室外照',
            parentId: 1,
            photoCount: 15,
            createdAt: '2023-05-13'
          }
        ]
      },
      {
        id: 2,
        name: '儿童摄影',
        description: '儿童摄影作品集',
        photoCount: 18,
        isPublic: false,
        createdAt: '2023-06-20'
      },
      {
        id: 5,
        name: '商业摄影',
        description: '商业项目照片',
        photoCount: 30,
        isPublic: false,
        createdAt: '2023-07-05'
      }
    ];
    return { data: mockAlbums };
  } catch (error) {
    message.error('获取相册列表失败');
    throw error;
  }
}

// 创建照片相册
export async function createPhotoAlbum(data: {
  name: string;
  description?: string;
  parentId?: number | null;
  isPublic?: boolean;
}): Promise<{ data: any }> {
  try {
    const newAlbum = {
      id: Math.floor(Math.random() * 1000) + 100,
      name: data.name,
      description: data.description,
      parentId: data.parentId,
      isPublic: data.isPublic || false,
      photoCount: 0,
      createdAt: new Date().toISOString(),
    };
    return { data: newAlbum };
  } catch (error) {
    message.error('创建相册失败');
    throw error;
  }
}

// 更新照片相册
export async function updatePhotoAlbum(id: number, data: {
  name?: string;
  description?: string;
  parentId?: number | null;
  isPublic?: boolean;
}): Promise<{ data: any }> {
  try {
    return { data: { id, ...data, updatedAt: new Date().toISOString() } };
  } catch (error) {
    message.error('更新相册失败');
    throw error;
  }
}

// 删除照片相册
export async function deletePhotoAlbum(id: number): Promise<{ success: boolean }> {
  try {
    return { success: true };
  } catch (error) {
    message.error('删除相册失败');
    throw error;
  }
}

// 上传照片
export async function uploadPhotos(formData: FormData): Promise<{ success: boolean; data?: any[] }> {
  try {
    return { 
      success: true,
      data: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
        id: Math.floor(Math.random() * 1000) + 1000,
        name: `照片${i+1}.jpg`,
        url: `https://via.placeholder.com/800/RANDOM/FFFFFF?text=Photo+${i+1}`,
        thumbnailUrl: `https://via.placeholder.com/200/RANDOM/FFFFFF?text=Photo+${i+1}`,
        size: Math.floor(Math.random() * 10000000) + 1000000,
        createdAt: new Date().toISOString()
      }))
    };
  } catch (error) {
    message.error('照片上传失败');
    throw error;
  }
}

// 删除照片
export async function deletePhotos(photoIds: number[]): Promise<{ success: boolean }> {
  try {
    return { success: true };
  } catch (error) {
    message.error('删除照片失败');
    throw error;
  }
}

// 更新照片信息
export async function updatePhoto(photoId: number, data: any): Promise<{ success: boolean }> {
  try {
    return { success: true };
  } catch (error) {
    message.error('更新照片信息失败');
    throw error;
  }
}

// 分享照片
export async function sharePhotos(photoIds: number[]): Promise<{ data: { url: string; password?: string } }> {
  try {
    const shareId = Math.random().toString(36).substring(2, 10);
    return {
      data: {
        url: `https://yourphotosite.com/share/${shareId}`,
        password: Math.random().toString(36).substring(2, 8)
      }
    };
  } catch (error) {
    message.error('分享照片失败');
    throw error;
  }
}
