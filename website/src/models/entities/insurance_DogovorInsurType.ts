import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { SCurrency } from "./insurance_SCurrency";
export class DogovorInsurType extends BaseUuidEntity {
  static NAME = "insurance_DogovorInsurType";
  idDogovor?: any | null;
  idInsurType?: number | null;
  idSCurrencyIns?: SCurrency | null;
  idSCurrencyKom?: SCurrency | null;
  idSCurrencyPre?: SCurrency | null;
  insurKom?: any | null;
  insurPrem?: any | null;
  insurSumma?: any | null;
  oldDog?: boolean | null;
}
export type DogovorInsurTypeViewName = "_base" | "_local" | "_minimal";
export type DogovorInsurTypeView<V extends DogovorInsurTypeViewName> =
  V extends "_base"
    ? Pick<
        DogovorInsurType,
        | "id"
        | "idDogovor"
        | "idInsurType"
        | "insurKom"
        | "insurPrem"
        | "insurSumma"
        | "oldDog"
      >
    : V extends "_local"
    ? Pick<
        DogovorInsurType,
        | "id"
        | "idDogovor"
        | "idInsurType"
        | "insurKom"
        | "insurPrem"
        | "insurSumma"
        | "oldDog"
      >
    : V extends "_minimal"
    ? Pick<DogovorInsurType, "id">
    : never;
