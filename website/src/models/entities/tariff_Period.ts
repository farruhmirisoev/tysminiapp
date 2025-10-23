import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class Period extends BaseIntegerIdEntity {
  static NAME = "tariff_Period";
  value?: number | null;
  tariff?: any | null;
}
export type PeriodViewName = "_base" | "_local" | "_minimal";
export type PeriodView<V extends PeriodViewName> = never;
