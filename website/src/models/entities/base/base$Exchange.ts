import { StandardEntity } from "./sys$StandardEntity";
import { DicCurrency } from "./base$DicCurrency";
export class Exchange extends StandardEntity {
  static NAME = "base$Exchange";
  currency?: DicCurrency | null;
  date?: any | null;
  rate?: any | null;
}
export type ExchangeViewName = "_base" | "_local" | "_minimal";
export type ExchangeView<V extends ExchangeViewName> = V extends "_base"
  ? Pick<Exchange, "id" | "currency" | "date" | "rate">
  : V extends "_local"
  ? Pick<Exchange, "id" | "date" | "rate">
  : V extends "_minimal"
  ? Pick<Exchange, "id" | "currency">
  : never;
