import { StandardEntity } from "./base/sys$StandardEntity";
import { ClaimProtocol } from "./ClaimProtocol";
import { ContractExt } from "./base$ContractExt";
import { Policy } from "./base$Policy";
import { Claim } from "./baseClaim";
export class ClaimProtocolDetail extends StandardEntity {
  static NAME = "ClaimProtocolDetail";
  claimProtocol?: ClaimProtocol | null;
  contract?: ContractExt | null;
  policy?: Policy | null;
  claim?: Claim | null;
  description?: string | null;
}
export type ClaimProtocolDetailViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "claimProtocolDetail-view"
  | "claimProtocolDetail-view";
export type ClaimProtocolDetailView<
  V extends ClaimProtocolDetailViewName
> = V extends "_base"
  ? Pick<ClaimProtocolDetail, "id" | "claim" | "description">
  : V extends "_local"
  ? Pick<ClaimProtocolDetail, "id" | "description">
  : V extends "_minimal"
  ? Pick<ClaimProtocolDetail, "id" | "claim">
  : V extends "claimProtocolDetail-view"
  ? Pick<ClaimProtocolDetail, "id" | "claim" | "claimProtocol">
  : V extends "claimProtocolDetail-view"
  ? Pick<ClaimProtocolDetail, "id" | "claim" | "claimProtocol">
  : never;
