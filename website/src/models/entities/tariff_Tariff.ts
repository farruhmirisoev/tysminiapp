import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import {
  Base,
  uz_softclub_insurance_product_tariff_PeriodType,
  PeriodInterval,
  MoneyPercent,
} from "../enums/enums";
import { Period } from "./tariff_Period";
import { Goods } from "./insurance_Goods";
export class Tariff extends BaseIntegerIdEntity {
  static NAME = "tariff_Tariff";
  base?: Base | null;
  periodType?: uz_softclub_insurance_product_tariff_PeriodType | null;
  tariff?: any | null;
  periodInterval?: PeriodInterval | null;
  periodList?: Period | null;
  premiumFixType?: MoneyPercent | null;
  premiumDecision?: number | null;
  goods?: Goods | null;
}
export type TariffViewName = "_base" | "_local" | "_minimal";
export type TariffView<V extends TariffViewName> = never;
