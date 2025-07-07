import * as moment from 'moment';

export const formatDate = (date: string | Date): Date => {
  return moment(date).toDate();
};

export const isWeekend = (date: string | Date): boolean => {
  const dayOfWeek = moment(date).day();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

export const getDateRange = (startDate: string, days: number): Date[] => {
  const dates: Date[] = [];
  let currentDate = moment(startDate);
  
  for (let i = 0; i < days; i++) {
    dates.push(currentDate.clone().toDate());
    currentDate = currentDate.add(1, 'day');
  }
  
  return dates;
};
