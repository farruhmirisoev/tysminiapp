import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
export class InsurProd extends BaseLongIdEntity {
  static NAME = "insurance_InsurProd";
  agentPerc?: any | null;
  className?: string | null;
  comments?: string | null;
  dateB?: any | null;
  dateE?: any | null;
  daysMax?: any | null;
  daysMin?: any | null;
  emp?: number | null;
  getGrant?: boolean | null;
  idSStatus?: number | null;
  idSStatusIsEdit?: boolean | null;
  insurTypeIsEdit?: boolean | null;
  kod?: string | null;
  kodPolicySer?: string | null;
  limit?: any | null;
  name?: string | null;
  perDay?: number | null;
  pref?: string | null;
  prodMain?: number | null;
  standProd?: boolean | null;
  state?: number | null;
  vDate?: any | null;
  visibleOnDog?: boolean | null;
}
export type InsurProdViewName = "_base" | "_local" | "_minimal";
export type InsurProdView<V extends InsurProdViewName> = V extends "_base"
  ? Pick<
      InsurProd,
      | "id"
      | "name"
      | "agentPerc"
      | "className"
      | "comments"
      | "dateB"
      | "dateE"
      | "daysMax"
      | "daysMin"
      | "emp"
      | "getGrant"
      | "idSStatus"
      | "idSStatusIsEdit"
      | "insurTypeIsEdit"
      | "kod"
      | "kodPolicySer"
      | "limit"
      | "perDay"
      | "pref"
      | "prodMain"
      | "standProd"
      | "state"
      | "vDate"
      | "visibleOnDog"
    >
  : V extends "_local"
  ? Pick<
      InsurProd,
      | "id"
      | "agentPerc"
      | "className"
      | "comments"
      | "dateB"
      | "dateE"
      | "daysMax"
      | "daysMin"
      | "emp"
      | "getGrant"
      | "idSStatus"
      | "idSStatusIsEdit"
      | "insurTypeIsEdit"
      | "kod"
      | "kodPolicySer"
      | "limit"
      | "name"
      | "perDay"
      | "pref"
      | "prodMain"
      | "standProd"
      | "state"
      | "vDate"
      | "visibleOnDog"
    >
  : V extends "_minimal"
  ? Pick<InsurProd, "id" | "name">
  : never;
