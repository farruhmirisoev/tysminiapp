import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
export class Policy extends BaseLongIdEntity {
  static NAME = "insurance_Policy";
  dateProd?: any | null;
  dateVid?: any | null;
  dateVv?: any | null;
  idDogovor?: any | null;
  idMembers?: any | null;
  kodPolicySer?: string | null;
  num?: any | null;
  state?: number | null;
  legacyId?: any | null;
}
export type PolicyViewName = "_base" | "_local" | "_minimal";
export type PolicyView<V extends PolicyViewName> = V extends "_base"
  ? Pick<
      Policy,
      | "id"
      | "dateProd"
      | "dateVid"
      | "dateVv"
      | "idDogovor"
      | "idMembers"
      | "kodPolicySer"
      | "num"
      | "state"
      | "legacyId"
    >
  : V extends "_local"
  ? Pick<
      Policy,
      | "id"
      | "dateProd"
      | "dateVid"
      | "dateVv"
      | "idDogovor"
      | "idMembers"
      | "kodPolicySer"
      | "num"
      | "state"
      | "legacyId"
    >
  : never;
