import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
import { Members } from "./insurance_Members";
import { SVidAct } from "./insurance_SVidAct";
export class PolicyAct extends BaseLongIdEntity {
  static NAME = "insurance_PolicyAct";
  branch?: number | null;
  comments?: string | null;
  idMembersKomu?: Members | null;
  idMembersOt?: Members | null;
  idSVidAct?: SVidAct | null;
  num?: string | null;
  state?: number | null;
  vDate?: any | null;
}
export type PolicyActViewName = "_base" | "_local" | "_minimal";
export type PolicyActView<V extends PolicyActViewName> = V extends "_base"
  ? Pick<PolicyAct, "id" | "branch" | "comments" | "num" | "state" | "vDate">
  : V extends "_local"
  ? Pick<PolicyAct, "id" | "branch" | "comments" | "num" | "state" | "vDate">
  : never;
