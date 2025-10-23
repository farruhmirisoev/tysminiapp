import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { Organization } from "./company_Organization";
import { BaseContract } from "./BaseContract";
export class BaseContractAcl extends BaseUuidEntity {
  static NAME = "BaseContractAcl";
  createTs?: any | null;
  createdBy?: string | null;
  code?: number | null;
  organization?: Organization | null;
  contract?: BaseContract | null;
  global?: boolean | null;
  description?: string | null;
}
export type BaseContractAclViewName = "_base" | "_local" | "_minimal";
export type BaseContractAclView<V extends BaseContractAclViewName> =
  V extends "_base"
    ? Pick<BaseContractAcl, "id" | "code" | "global" | "description">
    : V extends "_local"
    ? Pick<BaseContractAcl, "id" | "code" | "global" | "description">
    : V extends "_minimal"
    ? Pick<BaseContractAcl, "id" | "code">
    : never;
