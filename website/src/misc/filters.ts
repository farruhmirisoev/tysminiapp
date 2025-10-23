import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

export function datetime(value: string, format: string) {
  return dayjs(value).format(format);
}

export function daysFromNow(value: string) {
  return dayjs().diff(dayjs(value), "days");
}

export function formatPirce(value: number): string {
  return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
}

export function gender(value: string): string {
  const { t } = useI18n();
  return value.toLowerCase() === "male" ? t('filters.gender.male') : t('filters.gender.female');
}

export default {
  datetime,
  daysFromNow,
  formatPirce,
  gender,
};
