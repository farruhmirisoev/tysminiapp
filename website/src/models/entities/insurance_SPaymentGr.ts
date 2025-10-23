import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SPaymentGr extends BaseIntegerIdEntity {
  static NAME = "insurance_SPaymentGr";
  name?: string | null;
}
export type SPaymentGrViewName = "_base" | "_local" | "_minimal";
export type SPaymentGrView<V extends SPaymentGrViewName> = V extends "_base"
  ? Pick<SPaymentGr, "id" | "name">
  : V extends "_local"
  ? Pick<SPaymentGr, "id" | "name">
  : V extends "_minimal"
  ? Pick<SPaymentGr, "id" | "name">
  : never;
