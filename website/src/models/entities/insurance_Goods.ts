import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { MinMaxType, PeriodInterval } from "../enums/enums";
export class Goods extends BaseIntegerIdEntity {
  static NAME = "insurance_Goods";
  name?: string | null;
  code?: string | null;
  minMaxType?: MinMaxType | null;
  max?: number | null;
  min?: number | null;
  tariffPeriod?: PeriodInterval | null;
  tariff?: any | null;
}
export type GoodsViewName = "_base" | "_local" | "_minimal";
export type GoodsView<V extends GoodsViewName> = V extends "_base"
  ? Pick<Goods, "id" | "name">
  : V extends "_minimal"
  ? Pick<Goods, "id" | "name">
  : never;
