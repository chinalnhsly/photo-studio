// 预约状态枚举
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

// 拍摄类型枚举
export enum ShootingType {
  STANDARD = 'standard',
  WEDDING = 'wedding',
  PORTRAIT = 'portrait',
  FAMILY = 'family',
  CHILDREN = 'children',
  MATERNITY = 'maternity',
  NEWBORN = 'newborn',
  EVENT = 'event',
  PRODUCT = 'product',
  COMMERCIAL = 'commercial',
  CUSTOM = 'custom',
}

// 预约接口定义
export interface Booking {
  id: number;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  startTime: string;
  endTime: string;
  shootingType: ShootingType;
  status: BookingStatus;
  photographerId?: number;
  studioId?: number;
  packageId?: number;
  notes?: string;
  customerNote?: string;
  staffNote?: string;
  createdAt: string;
  updatedAt: string;
  photographer?: {
    id: number;
    name: string;
  };
  studio?: {
    id: number;
    name: string;
  };
}

// 可用时段接口定义
export interface AvailableSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  photographerId?: number;
  studioId?: number;
  isBooked: boolean;
  createdAt: string;
}
