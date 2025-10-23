import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { AccountType } from "../enums/enums";
import { AccountChartSubconto } from "./insurance_AccountChartSubconto";
export class AccountChart extends BaseIntegerIdEntity {
  static NAME = "accounting$AccountChart";
  code?: string | null;
  name?: string | null;
  offBalanceAccount?: boolean | null;
  type?: AccountType | null;
  currency?: boolean | null;
  amount?: boolean | null;
  subdivision?: boolean | null;
  prohibit?: boolean | null;
  parent?: AccountChart | null;
  subconto?: AccountChartSubconto[] | null;
}
export type AccountChartViewName = "_base" | "_local" | "_minimal";
export type AccountChartView<V extends AccountChartViewName> = V extends "_base"
  ? Pick<
      AccountChart,
      | "id"
      | "code"
      | "name"
      | "offBalanceAccount"
      | "type"
      | "currency"
      | "amount"
      | "subdivision"
      | "prohibit"
    >
  : V extends "_local"
  ? Pick<
      AccountChart,
      | "id"
      | "code"
      | "name"
      | "offBalanceAccount"
      | "type"
      | "currency"
      | "amount"
      | "subdivision"
      | "prohibit"
    >
  : V extends "_minimal"
  ? Pick<AccountChart, "id" | "code" | "name">
  : never;
