// 交易类型
export enum TransactionType {
  PAYMENT = 'payment',           // 收款
  REFUND = 'refund',             // 退款
  EXPENSE = 'expense',           // 支出
  TRANSFER = 'transfer',         // 内部转账
  ADJUSTMENT = 'adjustment',     // 调整
  DEPOSIT = 'deposit',           // 订金
}

// 支付方式
export enum PaymentMethod {
  CASH = 'cash',                 // 现金
  WECHAT = 'wechat',             // 微信
  ALIPAY = 'alipay',             // 支付宝
  CARD = 'card',                 // 银行卡
  TRANSFER = 'transfer',         // 银行转账
  OTHER = 'other',               // 其他
}

// 交易记录接口
export interface Transaction {
  id: number;
  transactionId: string;         // 交易编号
  date: string;                  // 交易日期
  amount: number;                // 交易金额
  type: TransactionType;         // 交易类型
  paymentMethod: PaymentMethod;  // 支付方式
  categoryId?: number;           // 分类ID
  category?: TransactionCategory; // 分类信息
  customerId?: number;           // 客户ID
  customerName?: string;         // 客户名称
  orderId?: number;              // 关联订单ID
  orderNumber?: string;          // 关联订单编号
  description?: string;          // 交易描述
  attachments?: string[];        // 附件，如收据图片
  createdBy: number;             // 创建人ID
  createdAt: string;             // 创建时间
  updatedAt: string;             // 更新时间
}

// 交易分类接口
export interface TransactionCategory {
  id: number;
  name: string;                  // 分类名称
  type: 'income' | 'expense';    // 收入或支出
  parentId?: number;             // 父分类ID
  level: number;                 // 分类层级
  path: string;                  // 分类路径，如 "1,2,3"
  children?: TransactionCategory[]; // 子分类
  createdAt: string;
  updatedAt: string;
}

// 财务汇总接口
export interface FinancialSummary {
  totalRevenue: number;          // 总收入
  totalExpense: number;          // 总支出
  netIncome: number;             // 净收入
  totalRefunds: number;          // 总退款
  totalOrders: number;           // 订单总数
  averageOrderValue: number;     // 平均客单价
  revenueGrowth: number;         // 收入环比增长率
  expenseGrowth: number;         // 支出环比增长率
  orderGrowth: number;           // 订单环比增长率
  aovGrowth: number;             // 客单价环比增长率
  period: string;                // 统计周期
}

// 财务统计接口（按日期）
export interface FinancialStats {
  period: string;                // 统计周期（日期）
  revenue: number;               // 收入
  expense: number;               // 支出
  netIncome: number;             // 净收入
  orders: number;                // 订单数
  aov: number;                   // 平均客单价
}

// 财务分类统计接口
export interface CategoryStats {
  categoryId: number;
  name: string;                  // 分类名称
  value: number;                 // 金额
  count: number;                 // 笔数
  percentage: number;            // 占比
}

// 财务查询参数接口
export interface FinanceQueryParams {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  categoryId?: number;
  paymentMethod?: PaymentMethod;
  customerId?: number;
  orderId?: number;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}
