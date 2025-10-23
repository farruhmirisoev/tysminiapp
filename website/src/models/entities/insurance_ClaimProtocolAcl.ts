import { StandardEntity } from "./base/sys$StandardEntity";
import { OrganizationExt } from "./base$OrganizationExt";
import { UserExtend } from "./extend_User";
import { ClaimProtocol } from "./ClaimProtocol";
export class ClaimProtocolAcl extends StandardEntity {
  static NAME = "insurance_ClaimProtocolAcl";
  organizationExt?: OrganizationExt | null;
  user?: UserExtend | null;
  protocol?: ClaimProtocol | null;
}
export type ClaimProtocolAclViewName = "_base" | "_local" | "_minimal";
export type ClaimProtocolAclView<
  V extends ClaimProtocolAclViewName
> = V extends "_base"
  ? Pick<ClaimProtocolAcl, "id" | "protocol">
  : V extends "_minimal"
  ? Pick<ClaimProtocolAcl, "id" | "protocol">
  : never;
