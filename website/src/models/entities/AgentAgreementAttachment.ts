import { Attachment } from "./base/base$Attachment";
import { AgentAgreement } from "./AgentAgreement";
export class AgentAgreementAttachment extends Attachment {
  static NAME = "AgentAgreementAttachment";
  agentAgreement?: AgentAgreement | null;
}
export type AgentAgreementAttachmentViewName = "_base" | "_local" | "_minimal";
export type AgentAgreementAttachmentView<
  V extends AgentAgreementAttachmentViewName
> = V extends "_base"
  ? Pick<
      AgentAgreementAttachment,
      | "id"
      | "name"
      | "legacyId"
      | "fundId"
      | "number"
      | "issuer"
      | "issueDate"
      | "validEndDate"
      | "comment"
      | "series"
      | "check"
      | "checkDate"
    >
  : V extends "_local"
  ? Pick<
      AgentAgreementAttachment,
      | "id"
      | "legacyId"
      | "fundId"
      | "number"
      | "issuer"
      | "issueDate"
      | "validEndDate"
      | "name"
      | "comment"
      | "series"
      | "check"
      | "checkDate"
    >
  : V extends "_minimal"
  ? Pick<AgentAgreementAttachment, "id" | "name">
  : never;
