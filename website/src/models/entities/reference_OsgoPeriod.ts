import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { OsgoPeriodType } from "../enums/enums";
export class Period extends BaseIntegerIdEntity {
  static NAME = "reference_OsgoPeriod";
  name?: string | null;
  nameUz?: string | null;
  periodType?: OsgoPeriodType | null;
  months?: number | null;
  days?: number | null;
  fundSeason?: number | null;
  fundForeign?: number | null;
  coefficient?: any | null;
  order?: number | null;
}
export type PeriodViewName = "_base" | "_local" | "_minimal";
export type PeriodView<V extends PeriodViewName> = V extends "_base"
  ? Pick<
      Period,
      | "id"
      | "name"
      | "nameUz"
      | "periodType"
      | "months"
      | "days"
      | "fundSeason"
      | "fundForeign"
      | "coefficient"
      | "order"
    >
  : V extends "_local"
  ? Pick<
      Period,
      | "id"
      | "name"
      | "nameUz"
      | "periodType"
      | "months"
      | "days"
      | "fundSeason"
      | "fundForeign"
      | "coefficient"
      | "order"
    >
  : V extends "_minimal"
  ? Pick<Period, "id" | "name">
  : never;
