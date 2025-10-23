import { AbstractDocument } from "./AbstractDocument";
import { FileDescriptor } from "./sys$FileDescriptor";
import { AttachmentType } from "./base$AttachmentType";
import { UserExt } from "./base$UserExt";
import { Party } from "./base$Party";
import { Organization } from "./base$Organization";
import { Contract } from "./base$Contract";
export class Attachment extends AbstractDocument {
  static NAME = "base$Attachment";
  name?: string | null;
  comment?: string | null;
  file?: FileDescriptor | null;
  attachType?: AttachmentType | null;
  series?: string | null;
  check?: any | null;
  checkDate?: any | null;
  moderator?: UserExt | null;
  party?: Party | null;
  organization?: Organization | null;
  contract?: Contract | null;
}
export type AttachmentViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "attachment-view";
export type AttachmentView<V extends AttachmentViewName> = V extends "_base"
  ? Pick<
      Attachment,
      | "id"
      | "name"
      | "comment"
      | "series"
      | "check"
      | "checkDate"
      | "legacyId"
      | "fundId"
      | "number"
      | "issuer"
      | "issueDate"
      | "validEndDate"
    >
  : V extends "_local"
  ? Pick<
      Attachment,
      | "id"
      | "name"
      | "comment"
      | "series"
      | "check"
      | "checkDate"
      | "legacyId"
      | "fundId"
      | "number"
      | "issuer"
      | "issueDate"
      | "validEndDate"
    >
  : V extends "_minimal"
  ? Pick<Attachment, "id" | "name">
  : V extends "attachment-view"
  ? Pick<
      Attachment,
      | "id"
      | "name"
      | "comment"
      | "series"
      | "check"
      | "checkDate"
      | "legacyId"
      | "fundId"
      | "number"
      | "issuer"
      | "issueDate"
      | "validEndDate"
      | "file"
      | "attachType"
    >
  : never;
