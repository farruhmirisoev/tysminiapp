import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
import { SCurrency } from "./insurance_SCurrency";
export class Dogovor extends BaseLongIdEntity {
  static NAME = "insurance_Dogovor";
  bonusProc?: any | null;
  branch?: number | null;
  comments?: string | null;
  curRate?: any | null;
  dateAn?: any | null;
  dateB?: any | null;
  dateD?: any | null;
  dateE?: any | null;
  dateOtchPer?: any | null;
  dateZ?: any | null;
  errMsg?: string | null;
  idInsurProd?: any | null;
  idSBuyer?: any | null;
  idSInsurant?: any | null;
  idSStatus?: number | null;
  idSStatusPer?: number | null;
  idUsers?: number | null;
  kodSCurrency?: SCurrency | null;
  kodSCurrencyR?: string | null;
  limit?: any | null;
  num?: string | null;
  numZ?: string | null;
  oldDog?: boolean | null;
  osgoUuid?: string | null;
  osgoUuidNew?: string | null;
  perVhod?: boolean | null;
  rashKomp?: any | null;
  selo?: number | null;
  state?: number | null;
  summaVozv?: any | null;
  vDate?: any | null;
  legacyId?: any | null;
}
export type DogovorViewName = "_base" | "_local" | "_minimal";
export type DogovorView<V extends DogovorViewName> = V extends "_base"
  ? Pick<
      Dogovor,
      | "id"
      | "bonusProc"
      | "branch"
      | "comments"
      | "curRate"
      | "dateAn"
      | "dateB"
      | "dateD"
      | "dateE"
      | "dateOtchPer"
      | "dateZ"
      | "errMsg"
      | "idInsurProd"
      | "idSBuyer"
      | "idSInsurant"
      | "idSStatus"
      | "idSStatusPer"
      | "idUsers"
      | "kodSCurrencyR"
      | "limit"
      | "num"
      | "numZ"
      | "oldDog"
      | "osgoUuid"
      | "osgoUuidNew"
      | "perVhod"
      | "rashKomp"
      | "selo"
      | "state"
      | "summaVozv"
      | "vDate"
      | "legacyId"
    >
  : V extends "_local"
  ? Pick<
      Dogovor,
      | "id"
      | "bonusProc"
      | "branch"
      | "comments"
      | "curRate"
      | "dateAn"
      | "dateB"
      | "dateD"
      | "dateE"
      | "dateOtchPer"
      | "dateZ"
      | "errMsg"
      | "idInsurProd"
      | "idSBuyer"
      | "idSInsurant"
      | "idSStatus"
      | "idSStatusPer"
      | "idUsers"
      | "kodSCurrencyR"
      | "limit"
      | "num"
      | "numZ"
      | "oldDog"
      | "osgoUuid"
      | "osgoUuidNew"
      | "perVhod"
      | "rashKomp"
      | "selo"
      | "state"
      | "summaVozv"
      | "vDate"
      | "legacyId"
    >
  : never;
