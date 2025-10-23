import { Attachment } from "./base/base$Attachment";
import { AgentAct } from "./agentact$AgentAct";
export class AgentActAttachment extends Attachment {
  static NAME = "AgentActAttachment";
  agentAct?: AgentAct | null;
}
export type AgentActAttachmentViewName = "_base" | "_local" | "_minimal";
export type AgentActAttachmentView<V extends AgentActAttachmentViewName> =
  V extends "_base"
    ? Pick<
        AgentActAttachment,
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
        AgentActAttachment,
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
    ? Pick<AgentActAttachment, "id" | "name">
    : never;
