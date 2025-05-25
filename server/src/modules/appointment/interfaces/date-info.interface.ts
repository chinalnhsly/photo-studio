export interface TimeSlotInfo {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface DateInfo {
  date: string;
  isAvailable: boolean;
  fullBooked: boolean;
  price: number;
  weekday: string;
  timeSlots: TimeSlotInfo[];
}
