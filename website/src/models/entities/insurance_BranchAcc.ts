import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { Branch } from "./insurance_Branch";
import { SMfo } from "./insurance_SMfo";
export class BranchAcc extends BaseUuidEntity {
  static NAME = "insurance_BranchAcc";
  acc?: string | null;
  bankIdBranch?: Branch | null;
  bankIdSMfo?: SMfo | null;
  comments?: string | null;
}
export type BranchAccViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "branchAcc-import-view";
export type BranchAccView<V extends BranchAccViewName> = V extends "_base"
  ? Pick<BranchAcc, "id" | "acc" | "comments">
  : V extends "_local"
  ? Pick<BranchAcc, "id" | "acc" | "comments">
  : V extends "branchAcc-import-view"
  ? Pick<BranchAcc, "id" | "acc" | "comments" | "bankIdSMfo">
  : never;
