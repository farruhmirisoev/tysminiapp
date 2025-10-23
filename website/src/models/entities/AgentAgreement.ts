import { AbstractContract } from "./base/AbstractContract";
import { AgentAgreementGroup } from "./AgentAgreementGroup";
import { OrganizationExt } from "./base$OrganizationExt";
import { BaseContractStatus } from "../enums/enums";
import { AgentAgreementAcl } from "./AgentAgreementAcl";
import { Individual } from "./base/base$Individual";
import { AgentAgreementAttachment } from "./AgentAgreementAttachment";
import { ContractExt } from "./base$ContractExt";
import { AgentActDetail } from "./agentact$AgentActDetail";
export class AgentAgreement extends AbstractContract {
  static NAME = "AgentAgreement";
  group?: AgentAgreementGroup | null;
  autoProlongation?: boolean | null;
  maxCommission?: any | null;
  organizationExt?: OrganizationExt | null;
  terminateDate?: any | null;
  status?: BaseContractStatus | null;
  agentAgreementAcl?: AgentAgreementAcl[] | null;
  agents?: Individual[] | null;
  attachments?: AgentAgreementAttachment[] | null;
  contractExts?: ContractExt[] | null;
  agentActDetails?: AgentActDetail[] | null;
}
export type AgentAgreementViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "agentAgreement-view";
export type AgentAgreementView<V extends AgentAgreementViewName> =
  V extends "_base"
    ? Pick<
        AgentAgreement,
        | "id"
        | "contractNumber"
        | "party"
        | "autoProlongation"
        | "maxCommission"
        | "terminateDate"
        | "status"
        | "legacyId"
        | "fundId"
        | "startDate"
        | "endDate"
        | "writeHistory"
        | "partyType"
        | "contractDate"
        | "contractStartDate"
        | "contractEndDate"
        | "description"
        | "fixDate"
      >
    : V extends "_local"
    ? Pick<
        AgentAgreement,
        | "id"
        | "autoProlongation"
        | "maxCommission"
        | "terminateDate"
        | "status"
        | "legacyId"
        | "fundId"
        | "startDate"
        | "endDate"
        | "writeHistory"
        | "partyType"
        | "contractNumber"
        | "contractDate"
        | "contractStartDate"
        | "contractEndDate"
        | "description"
        | "fixDate"
      >
    : V extends "_minimal"
    ? Pick<AgentAgreement, "id" | "contractNumber" | "party">
    : V extends "agentAgreement-view"
    ? Pick<
        AgentAgreement,
        | "id"
        | "autoProlongation"
        | "maxCommission"
        | "terminateDate"
        | "status"
        | "legacyId"
        | "fundId"
        | "startDate"
        | "endDate"
        | "writeHistory"
        | "partyType"
        | "contractNumber"
        | "contractDate"
        | "contractStartDate"
        | "contractEndDate"
        | "description"
        | "fixDate"
        | "organizationExt"
        | "party"
      >
    : never;
