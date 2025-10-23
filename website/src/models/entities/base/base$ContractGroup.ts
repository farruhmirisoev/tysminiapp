import { AbstractGroup } from "./AbstractGroup";
export class ContractGroup extends AbstractGroup {
  static NAME = "base$ContractGroup";
}
export type ContractGroupViewName = "_base" | "_local" | "_minimal";
export type ContractGroupView<V extends ContractGroupViewName> =
  V extends "_base"
    ? Pick<ContractGroup, "id" | "legacyId" | "fundId">
    : V extends "_local"
    ? Pick<ContractGroup, "id" | "legacyId" | "fundId">
    : V extends "_minimal"
    ? Pick<ContractGroup, "id">
    : never;
