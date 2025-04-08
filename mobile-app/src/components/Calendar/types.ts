import { ReactNode } from 'react'


export interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  renderDay?: (date: Date) => ReactNode
}

export type DayElement = ReactNode
