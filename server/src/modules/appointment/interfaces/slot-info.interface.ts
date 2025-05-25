export interface SlotInfo {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface DateSlotInfo {
  date: string;
  isAvailable: boolean;
  slots: SlotInfo[];
}
