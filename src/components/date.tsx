import { format } from 'date-fns'

export default function Date({ date }: { date: Date }) {
  return (
    <time dateTime={date.toISOString()}>{format(date, 'dd LLLL yyyy')}</time>
  )
}
