import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { OrganizationExt } from "./base$OrganizationExt";
import { UserExtend } from "./extend_User";
import { Claim } from "./baseClaim";
export class ClaimAcl extends BaseUuidEntity {
  static NAME = "ClaimAcl";
  code?: number | null;
  organizationExt?: OrganizationExt | null;
  user?: UserExtend | null;
  claim?: Claim | null;
  description?: string | null;
}
export type ClaimAclViewName = "_base" | "_local" | "_minimal";
export type ClaimAclView<V extends ClaimAclViewName> = V extends "_base"
  ? Pick<ClaimAcl, "id" | "code" | "description">
  : V extends "_local"
  ? Pick<ClaimAcl, "id" | "code" | "description">
  : V extends "_minimal"
  ? Pick<ClaimAcl, "id" | "code">
  : never;
