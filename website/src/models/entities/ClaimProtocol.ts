import { Contract } from "./base/base$Contract";
import { ClaimProtocolState } from "../enums/enums";
import { ClaimProtocolDetail } from "./ClaimProtocolDetail";
import { ClaimProtocolAcl } from "./insurance_ClaimProtocolAcl";
export class ClaimProtocol extends Contract {
  static NAME = "ClaimProtocol";
  state?: ClaimProtocolState | null;
  details?: ClaimProtocolDetail[] | null;
  claimProtocolAcl?: ClaimProtocolAcl[] | null;
}
export type ClaimProtocolViewName = "_base" | "_local" | "_minimal";
export type ClaimProtocolView<
  V extends ClaimProtocolViewName
> = V extends "_base"
  ? Pick<
      ClaimProtocol,
      | "id"
      | "contractNumber"
      | "state"
      | "legacyId"
      | "fundId"
      | "startDate"
      | "endDate"
      | "writeHistory"
      | "partyType"
      | "contractDate"
      | "contractStartDate"
      | "contractEndDate"
      | "description"
      | "fixDate"
    >
  : V extends "_local"
  ? Pick<
      ClaimProtocol,
      | "id"
      | "state"
      | "legacyId"
      | "fundId"
      | "startDate"
      | "endDate"
      | "writeHistory"
      | "partyType"
      | "contractNumber"
      | "contractDate"
      | "contractStartDate"
      | "contractEndDate"
      | "description"
      | "fixDate"
    >
  : V extends "_minimal"
  ? Pick<ClaimProtocol, "id" | "contractNumber">
  : never;
