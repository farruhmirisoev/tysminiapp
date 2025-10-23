import { StandardEntity } from "./base/sys$StandardEntity";
import { Policy } from "./base$Policy";
import { DicCurrency } from "./base/base$DicCurrency";
export class Payment extends StandardEntity {
  static NAME = "customs$Payment";
  policy?: Policy | null;
  number?: string | null;
  date?: any | null;
  bonus?: any | null;
  amount?: any | null;
  currency?: DicCurrency | null;
  commission?: any | null;
}
export type PaymentViewName = "_base" | "_local" | "_minimal";
export type PaymentView<V extends PaymentViewName> = V extends "_base"
  ? Pick<Payment, "id" | "number" | "date" | "bonus" | "amount" | "commission">
  : V extends "_local"
  ? Pick<Payment, "id" | "number" | "date" | "bonus" | "amount" | "commission">
  : V extends "_minimal"
  ? Pick<Payment, "id" | "number">
  : never;
