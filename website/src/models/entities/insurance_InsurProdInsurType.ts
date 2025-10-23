import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { InsurProd } from "./insurance_InsurProd";
import { InsurType } from "./insurance_InsurType";
export class InsurProdInsurType extends BaseUuidEntity {
  static NAME = "insurance_InsurProdInsurType";
  idInsurProd?: InsurProd | null;
  idInsurType?: InsurType | null;
  idSCurrencyIns?: string | null;
  idSCurrencyKom?: string | null;
  idSCurrencyPre?: string | null;
  insurKom?: any | null;
  insurPrem?: any | null;
  insurPremPr?: any | null;
  insurSumma?: any | null;
  insurSummaPr?: any | null;
  rpm?: any | null;
}
export type InsurProdInsurTypeViewName = "_base" | "_local" | "_minimal";
export type InsurProdInsurTypeView<V extends InsurProdInsurTypeViewName> =
  V extends "_base"
    ? Pick<
        InsurProdInsurType,
        | "id"
        | "idSCurrencyIns"
        | "idSCurrencyKom"
        | "idSCurrencyPre"
        | "insurKom"
        | "insurPrem"
        | "insurPremPr"
        | "insurSumma"
        | "insurSummaPr"
        | "rpm"
      >
    : V extends "_local"
    ? Pick<
        InsurProdInsurType,
        | "id"
        | "idSCurrencyIns"
        | "idSCurrencyKom"
        | "idSCurrencyPre"
        | "insurKom"
        | "insurPrem"
        | "insurPremPr"
        | "insurSumma"
        | "insurSummaPr"
        | "rpm"
      >
    : never;
