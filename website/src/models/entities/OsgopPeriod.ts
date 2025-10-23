import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class OsgopPeriod extends BaseIntegerIdEntity {
  static NAME = "OsgopPeriod";
  name?: string | null;
  nameUz?: string | null;
  months?: number | null;
  order?: number | null;
  fundId?: number | null;
}
export type OsgopPeriodViewName = "_base" | "_local" | "_minimal";
export type OsgopPeriodView<V extends OsgopPeriodViewName> = V extends "_base"
  ? Pick<OsgopPeriod, "id" | "name" | "nameUz" | "months" | "order" | "fundId">
  : V extends "_local"
  ? Pick<OsgopPeriod, "id" | "name" | "nameUz" | "months" | "order" | "fundId">
  : V extends "_minimal"
  ? Pick<OsgopPeriod, "id" | "name">
  : never;
