import { ContractGroup } from "./base/base$ContractGroup";
import { ContractExt } from "./base$ContractExt";
export class ContractGroupExt extends ContractGroup {
  static NAME = "base$ContractGroupExt";
  list?: ContractExt[] | null;
  contract?: ContractExt | null;
  relevantContract?: ContractExt | null;
}
export type ContractGroupExtViewName = "_base" | "_local" | "_minimal";
export type ContractGroupExtView<V extends ContractGroupExtViewName> =
  V extends "_base"
    ? Pick<ContractGroupExt, "id" | "legacyId" | "fundId">
    : V extends "_local"
    ? Pick<ContractGroupExt, "id" | "legacyId" | "fundId">
    : V extends "_minimal"
    ? Pick<ContractGroupExt, "id">
    : never;
