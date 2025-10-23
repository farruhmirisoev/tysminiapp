import { Attachment } from "./base/base$Attachment";
import { Claim } from "./baseClaim";
export class ClaimAttachment extends Attachment {
  static NAME = "ClaimAttachment";
  claim?: Claim | null;
}
export type ClaimAttachmentViewName = "_base" | "_local" | "_minimal";
export type ClaimAttachmentView<V extends ClaimAttachmentViewName> =
  V extends "_base"
    ? Pick<
        ClaimAttachment,
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
        ClaimAttachment,
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
    ? Pick<ClaimAttachment, "id" | "name">
    : never;
