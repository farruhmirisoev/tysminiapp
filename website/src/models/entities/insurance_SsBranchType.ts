import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SsBranchType extends BaseIntegerIdEntity {
  static NAME = "insurance_SsBranchType";
  name?: string | null;
}
export type SsBranchTypeViewName = "_base" | "_local" | "_minimal";
export type SsBranchTypeView<V extends SsBranchTypeViewName> = V extends "_base"
  ? Pick<SsBranchType, "id" | "name">
  : V extends "_local"
  ? Pick<SsBranchType, "id" | "name">
  : V extends "_minimal"
  ? Pick<SsBranchType, "id" | "name">
  : never;
