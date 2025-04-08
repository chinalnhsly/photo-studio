
import type { ViewProps } from '@tarojs/components'

export interface CalendarProps {
  /** 当前选择的日期 */
  value?: Date
  /** 日期变化回调 */
  onChange?: (date: Date) => void
  /** 可选择的最小日期 */
  minDate?: Date
  /** 可选择的最大日期 */
  maxDate?: Date
  /** 禁用的日期 */
  disabledDates?: Date[]
}

export interface DayProps {
  date?: Date
  isSelected?: boolean
  isDisabled?: boolean
  isEmpty?: boolean
}

export type CalendarDayProps = DayProps & ViewProps
