import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
export class PolicySer extends BaseLongIdEntity {
  static NAME = "insurance_PolicySer";
  comments?: string | null;
  kod?: string | null;
  name?: string | null;
  nomenklat?: string | null;
  numKol?: number | null;
  state?: number | null;
  legacyId?: string | null;
}
export type PolicySerViewName = "_base" | "_local" | "_minimal";
export type PolicySerView<V extends PolicySerViewName> = V extends "_base"
  ? Pick<
      PolicySer,
      | "id"
      | "name"
      | "comments"
      | "kod"
      | "nomenklat"
      | "numKol"
      | "state"
      | "legacyId"
    >
  : V extends "_local"
  ? Pick<
      PolicySer,
      | "id"
      | "comments"
      | "kod"
      | "name"
      | "nomenklat"
      | "numKol"
      | "state"
      | "legacyId"
    >
  : V extends "_minimal"
  ? Pick<PolicySer, "id" | "name">
  : never;
