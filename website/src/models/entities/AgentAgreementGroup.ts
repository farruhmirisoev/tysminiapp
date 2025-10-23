import { AbstractGroup } from "./base/AbstractGroup";
import { AgentAgreement } from "./AgentAgreement";
export class AgentAgreementGroup extends AbstractGroup {
  static NAME = "AgentAgreementGroup";
  list?: AgentAgreement[] | null;
}
export type AgentAgreementGroupViewName = "_base" | "_local" | "_minimal";
export type AgentAgreementGroupView<V extends AgentAgreementGroupViewName> =
  V extends "_base"
    ? Pick<AgentAgreementGroup, "id" | "legacyId" | "fundId">
    : V extends "_local"
    ? Pick<AgentAgreementGroup, "id" | "legacyId" | "fundId">
    : V extends "_minimal"
    ? Pick<AgentAgreementGroup, "id">
    : never;
