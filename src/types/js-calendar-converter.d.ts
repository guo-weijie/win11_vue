declare module "js-calendar-converter" {
  interface LunarResult {
    lunarYear: number;
    lunarMonth: number;
    lunarDate: number;
    lunarHour: number;
    lunarWeekDay: number;
    lunarYearCn: string;
    lunarMonthCn: string;
    lunarDateCn: string;
    solarTerm: string;
    dateStr: string;
    [key: string]: any;
  }

  export function getLunar(year: number, month: number, day: number): LunarResult;

  export function solar2lunar(year: number, month: number, day: number): LunarResult;
}
