import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { InsurProd } from "./insurance_InsurProd";
export class InsurProdSPaymentGr extends BaseUuidEntity {
  static NAME = "insurance_InsurProdSPaymentGr";
  idInsurProd?: InsurProd | null;
  idSPaymentGr?: number | null;
}
export type InsurProdSPaymentGrViewName = "_base" | "_local" | "_minimal";
export type InsurProdSPaymentGrView<V extends InsurProdSPaymentGrViewName> =
  V extends "_base"
    ? Pick<InsurProdSPaymentGr, "id" | "idSPaymentGr">
    : V extends "_local"
    ? Pick<InsurProdSPaymentGr, "id" | "idSPaymentGr">
    : never;
