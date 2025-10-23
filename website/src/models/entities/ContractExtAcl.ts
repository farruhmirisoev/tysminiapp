import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { ContractExt } from "./base$ContractExt";
import { OrganizationExt } from "./base$OrganizationExt";
import { UserExtend } from "./extend_User";
export class ContractExtAcl extends BaseUuidEntity {
  static NAME = "ContractExtAcl";
  contract?: ContractExt | null;
  organizationExt?: OrganizationExt | null;
  user?: UserExtend | null;
  description?: string | null;
}
export type ContractExtAclViewName = "_base" | "_local" | "_minimal";
export type ContractExtAclView<V extends ContractExtAclViewName> =
  V extends "_base"
    ? Pick<ContractExtAcl, "id" | "contract" | "description">
    : V extends "_local"
    ? Pick<ContractExtAcl, "id" | "description">
    : V extends "_minimal"
    ? Pick<ContractExtAcl, "id" | "contract">
    : never;
