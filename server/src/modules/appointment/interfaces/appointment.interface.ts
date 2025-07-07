export interface AppointmentCreateDto {
  productId: number;
  appointmentDate: string;
  timeSlotId: number;
  customerName: string;
  customerPhone: string;
  remark?: string;
}

export interface AppointmentResponseDto {
  id: number;
  productId: number;
  appointmentDate: Date;
  timeSlotId: number;
  status: string;
  customerName: string;
  customerPhone: string;
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlotInfo {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}
