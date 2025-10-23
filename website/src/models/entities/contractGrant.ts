import { StandardEntity } from "./base/sys$StandardEntity";
import { GrantType } from "./productGrantType";
import { ContractExt } from "./base$ContractExt";
import { UserExtend } from "./extend_User";
import { GrantStatus } from "../enums/enums";
export class Grant extends StandardEntity {
  static NAME = "contractGrant";
  grantType?: GrantType | null;
  contract?: ContractExt | null;
  user?: UserExtend | null;
  status?: GrantStatus | null;
  description?: string | null;
}
export type GrantViewName = "_base" | "_local" | "_minimal";
export type GrantView<V extends GrantViewName> = V extends "_base"
  ? Pick<Grant, "id" | "contract" | "status" | "description">
  : V extends "_local"
  ? Pick<Grant, "id" | "status" | "description">
  : V extends "_minimal"
  ? Pick<Grant, "id" | "contract">
  : never;
