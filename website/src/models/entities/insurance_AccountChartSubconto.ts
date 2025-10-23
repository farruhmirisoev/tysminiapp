import { StandardEntity } from "./base/sys$StandardEntity";
import { AccountChart } from "./accounting$AccountChart";
import { Subconto } from "./accounting$Subconto";
export class AccountChartSubconto extends StandardEntity {
  static NAME = "insurance_AccountChartSubconto";
  accountChart?: AccountChart | null;
  number?: number | null;
  subconto?: Subconto | null;
  onlyTurnover?: boolean | null;
  total?: boolean | null;
}
export type AccountChartSubcontoViewName = "_base" | "_local" | "_minimal";
export type AccountChartSubcontoView<V extends AccountChartSubcontoViewName> =
  V extends "_base"
    ? Pick<
        AccountChartSubconto,
        "id" | "subconto" | "number" | "onlyTurnover" | "total"
      >
    : V extends "_local"
    ? Pick<AccountChartSubconto, "id" | "number" | "onlyTurnover" | "total">
    : V extends "_minimal"
    ? Pick<AccountChartSubconto, "id" | "subconto">
    : never;
