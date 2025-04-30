// 积分变动类型
export enum PointLogType {
  PURCHASE = 'purchase',       // 购买商品
  REFUND = 'refund',           // 退款
  REGISTER = 'register',       // 注册赠送
  SIGN_IN = 'sign_in',         // 每日签到
  EXCHANGE = 'exchange',       // 积分兑换
  ADMIN_ADJUST = 'admin_adjust', // 管理员调整
  EXPIRED = 'expired',         // 积分过期
  EVENT = 'event',             // 活动奖励
  REFERRAL = 'referral',       // 推荐奖励
  REVIEW = 'review',           // 评价奖励
  OTHER = 'other'              // 其他
}

// 会员等级接口
export interface MemberLevel {
  id: number;
  name: string;
  code: string;
  icon?: string;
  pointsThreshold: number;
  discount: number;
  description?: string;
  benefits?: string[];
  isDefault: boolean;
  color?: string;
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

// 会员接口
export interface Member {
  id: number;
  userId: number;
  memberNo: string;
  levelId: number;
  level?: MemberLevel;
  points: number;
  totalSpent: number;
  orderCount: number;
  isActive: boolean;
  isSubscribed: boolean;
  birthday?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  lastPurchaseDate?: string;
  lastActivityDate?: string;
  nextLevelProgress?: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    avatar?: string;
    phone?: string;
    email?: string;
    gender?: 'male' | 'female' | 'other';
  }
}

// 积分记录
export interface PointLog {
  id: number;
  memberId: number;
  points: number;
  balanceAfter: number;
  type: PointLogType;
  description?: string;
  orderId?: number;
  createdAt: string;
  userId?: number;
}

// 会员标签
export interface MemberTag {
  id: number;
  name: string;
  color?: string;
  count?: number;
  createdAt: string;
  updatedAt: string;
}
