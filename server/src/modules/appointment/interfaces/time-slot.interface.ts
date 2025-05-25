export interface TimeSlot {
  id: number;
  startTime: Date;  // 修改为 Date 类型
  endTime: Date;    // 修改为 Date 类型
  isAvailable: boolean;
  price: number | null;
  maxBookings: number;
}

export interface TimeSlotGroup {
  date: string;
  isAvailable: boolean;
  slots: TimeSlot[];
}
