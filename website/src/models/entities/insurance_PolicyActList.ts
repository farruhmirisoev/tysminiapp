import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
export class PolicyActList extends BaseUuidEntity {
  static NAME = "insurance_PolicyActList";
  idPolicy?: any | null;
  idPolicyAct?: any | null;
  por?: number | null;
}
export type PolicyActListViewName = "_base" | "_local" | "_minimal";
export type PolicyActListView<V extends PolicyActListViewName> =
  V extends "_base"
    ? Pick<PolicyActList, "id" | "idPolicy" | "idPolicyAct" | "por">
    : V extends "_local"
    ? Pick<PolicyActList, "id" | "idPolicy" | "idPolicyAct" | "por">
    : never;
