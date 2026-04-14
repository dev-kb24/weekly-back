export interface WeekRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Converts an ISO week string (e.g. "2026-W15") to a date range
 * covering Monday 00:00:00 to Sunday 23:59:59 of that week.
 */
export function getWeekRange(week: string): WeekRange {
  const match = /^(\d{4})-W(\d{2})$/.exec(week);
  if (!match) {
    throw new Error(`Invalid week format: "${week}". Expected YYYY-Www.`);
  }

  const year = parseInt(match[1], 10);
  const weekNumber = parseInt(match[2], 10);

  // ISO 8601: week 1 is the week containing the first Thursday of the year.
  // Jan 4 is always in week 1.
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7; // 1=Mon … 7=Sun
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - (dayOfWeek - 1));

  const startDate = new Date(week1Monday);
  startDate.setUTCDate(week1Monday.getUTCDate() + (weekNumber - 1) * 7);
  startDate.setUTCHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 6);
  endDate.setUTCHours(23, 59, 59, 999);

  return { startDate, endDate };
}
