import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { AgentAgreement } from "./AgentAgreement";
import { ContractExt } from "./base$ContractExt";
export class ContractExtAgentAgreement extends BaseUuidEntity {
  static NAME = "ContractExtAgentAgreement";
  agentAgreement?: AgentAgreement | null;
  date?: any | null;
  amount?: any | null;
  contractExt?: ContractExt | null;
}
export type ContractExtAgentAgreementViewName = "_base" | "_local" | "_minimal";
export type ContractExtAgentAgreementView<
  V extends ContractExtAgentAgreementViewName
> = V extends "_base"
  ? Pick<ContractExtAgentAgreement, "id" | "agentAgreement" | "date" | "amount">
  : V extends "_local"
  ? Pick<ContractExtAgentAgreement, "id" | "date" | "amount">
  : V extends "_minimal"
  ? Pick<ContractExtAgentAgreement, "id" | "agentAgreement">
  : never;
