import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { OrganizationExt } from "./base$OrganizationExt";
import { UserExtend } from "./extend_User";
import { AgentAgreement } from "./AgentAgreement";
export class AgentAgreementAcl extends BaseUuidEntity {
  static NAME = "AgentAgreementAcl";
  code?: number | null;
  organizationExt?: OrganizationExt | null;
  user?: UserExtend | null;
  contract?: AgentAgreement | null;
  description?: string | null;
}
export type AgentAgreementAclViewName = "_base" | "_local" | "_minimal";
export type AgentAgreementAclView<V extends AgentAgreementAclViewName> =
  V extends "_base"
    ? Pick<AgentAgreementAcl, "id" | "code" | "description">
    : V extends "_local"
    ? Pick<AgentAgreementAcl, "id" | "code" | "description">
    : V extends "_minimal"
    ? Pick<AgentAgreementAcl, "id" | "code">
    : never;
