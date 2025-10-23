import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SUchGroup extends BaseIntegerIdEntity {
  static NAME = "insurance_SUchGroup";
  name?: string | null;
}
export type SUchGroupViewName = "_base" | "_local" | "_minimal";
export type SUchGroupView<V extends SUchGroupViewName> = V extends "_base"
  ? Pick<SUchGroup, "id" | "name">
  : V extends "_local"
  ? Pick<SUchGroup, "id" | "name">
  : V extends "_minimal"
  ? Pick<SUchGroup, "id" | "name">
  : never;
