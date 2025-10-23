import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
import { SCurrency } from "./insurance_SCurrency";
import { DogovorOplataRef } from "./insurance_DogovorOplataRef";
export class DogovorOplata extends BaseLongIdEntity {
  static NAME = "insurance_DogovorOplata";
  accCl?: string | null;
  accCo?: string | null;
  bankCl?: string | null;
  bankCo?: string | null;
  branch?: number | null;
  comment?: string | null;
  dDate?: any | null;
  docNum?: string | null;
  emp?: any | null;
  errMsg?: string | null;
  idBank?: any | null;
  idDogovor?: any | null;
  idSVidOplata?: number | null;
  idSVidRashod?: number | null;
  innCl?: string | null;
  kodSCurrency?: SCurrency | null;
  nameCl?: string | null;
  oldDog?: boolean | null;
  purpose?: string | null;
  sDeal?: number | null;
  state?: number | null;
  summa?: any | null;
  summaRash?: any | null;
  type?: number | null;
  vDate?: any | null;
  vDateBank?: any | null;
  legacyId?: any | null;
  dogovorOplataRef?: DogovorOplataRef[] | null;
}
export type DogovorOplataViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "dogovorOplata-view";
export type DogovorOplataView<V extends DogovorOplataViewName> =
  V extends "_base"
    ? Pick<
        DogovorOplata,
        | "id"
        | "accCl"
        | "accCo"
        | "bankCl"
        | "bankCo"
        | "branch"
        | "comment"
        | "dDate"
        | "docNum"
        | "emp"
        | "errMsg"
        | "idBank"
        | "idDogovor"
        | "idSVidOplata"
        | "idSVidRashod"
        | "innCl"
        | "nameCl"
        | "oldDog"
        | "purpose"
        | "sDeal"
        | "state"
        | "summa"
        | "summaRash"
        | "type"
        | "vDate"
        | "vDateBank"
        | "legacyId"
      >
    : V extends "_local"
    ? Pick<
        DogovorOplata,
        | "id"
        | "accCl"
        | "accCo"
        | "bankCl"
        | "bankCo"
        | "branch"
        | "comment"
        | "dDate"
        | "docNum"
        | "emp"
        | "errMsg"
        | "idBank"
        | "idDogovor"
        | "idSVidOplata"
        | "idSVidRashod"
        | "innCl"
        | "nameCl"
        | "oldDog"
        | "purpose"
        | "sDeal"
        | "state"
        | "summa"
        | "summaRash"
        | "type"
        | "vDate"
        | "vDateBank"
        | "legacyId"
      >
    : V extends "_minimal"
    ? Pick<DogovorOplata, "id">
    : V extends "dogovorOplata-view"
    ? Pick<
        DogovorOplata,
        | "id"
        | "accCl"
        | "accCo"
        | "bankCl"
        | "bankCo"
        | "branch"
        | "comment"
        | "dDate"
        | "docNum"
        | "emp"
        | "errMsg"
        | "idBank"
        | "idDogovor"
        | "idSVidOplata"
        | "idSVidRashod"
        | "innCl"
        | "nameCl"
        | "oldDog"
        | "purpose"
        | "sDeal"
        | "state"
        | "summa"
        | "summaRash"
        | "type"
        | "vDate"
        | "vDateBank"
        | "legacyId"
        | "kodSCurrency"
      >
    : never;
