export enum AppointmentStatus {
  PENDING = 'pending',         // 待确认
  CONFIRMED = 'confirmed',     // 已确认
  CANCELLED = 'cancelled',     // 已取消
  COMPLETED = 'completed',     // 已完成
  NO_SHOW = 'no_show'         // 未到店
}

export enum TimeSlotStatus {
  AVAILABLE = 'available',     // 可预约
  BOOKED = 'booked',          // 已预约
  CLOSED = 'closed',          // 不可用
  MAINTENANCE = 'maintenance'  // 维护中
}
