import { StandardEntity } from "./base/sys$StandardEntity";
import { Claim } from "./baseClaim";
import { AttachmentType } from "./base/base$AttachmentType";
export class ClaimLetterDoc extends StandardEntity {
  static NAME = "ClaimLetterDoc";
  claim?: Claim | null;
  attachType?: AttachmentType | null;
  name?: string | null;
}
export type ClaimLetterDocViewName = "_base" | "_local" | "_minimal";
export type ClaimLetterDocView<
  V extends ClaimLetterDocViewName
> = V extends "_base"
  ? Pick<ClaimLetterDoc, "id" | "name">
  : V extends "_local"
  ? Pick<ClaimLetterDoc, "id" | "name">
  : V extends "_minimal"
  ? Pick<ClaimLetterDoc, "id" | "name">
  : never;
