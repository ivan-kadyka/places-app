import { addDays, eachDayOfInterval, startOfDay } from "date-fns";
import { IDateRange } from "src/types/date-range";

 export function getDateRangeOrNextWeek(dateRange?: IDateRange): IDateRange {
  if (dateRange) {
    return dateRange;
  }
  const daysCount = 7;
  const from = startOfDay(new Date());
  const to = addDays(from, daysCount);

  return { from, to };
}

 export function getDaysBetween(range: IDateRange): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((range.to.getTime() - range.from.getTime()) / msPerDay);
  }

   export function getDaysInRange(range: IDateRange): Date[] {
    return eachDayOfInterval({
      start: range.from,
      end: range.to
    }).slice(0, -1)
  }