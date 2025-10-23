import { StandardEntity } from "./base/sys$StandardEntity";
import { Claim } from "./baseClaim";
import { Party } from "./base/base$Party";
import { DicRegion } from "./base/base$DicRegion";
import { Vehicle } from "./osgo_Vehicle";
export class ClaimResponsibleForDamage extends StandardEntity {
  static NAME = "insurance_ClaimResponsibleForDamage";
  claim?: Claim | null;
  partyType?: any | null;
  party?: Party | null;
  region?: DicRegion | null;
  declaredToOrganization?: string | null;
  supervisoryAuthorityConclusionDate?: any | null;
  supervisoryAuthorityConclusionNumber?: string | null;
  comment?: string | null;
  vehicle?: Vehicle | null;
  vehicleOwnerType?: any | null;
  vehicleOwner?: Party | null;
  fundId?: any | null;
  amount?: any | null;
}
export type ClaimResponsibleForDamageViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "claimResponsibleForDamage-view";
export type ClaimResponsibleForDamageView<
  V extends ClaimResponsibleForDamageViewName
> = V extends "_base"
  ? Pick<
      ClaimResponsibleForDamage,
      | "id"
      | "party"
      | "partyType"
      | "declaredToOrganization"
      | "supervisoryAuthorityConclusionDate"
      | "supervisoryAuthorityConclusionNumber"
      | "comment"
      | "vehicleOwnerType"
      | "fundId"
      | "amount"
    >
  : V extends "_local"
  ? Pick<
      ClaimResponsibleForDamage,
      | "id"
      | "partyType"
      | "declaredToOrganization"
      | "supervisoryAuthorityConclusionDate"
      | "supervisoryAuthorityConclusionNumber"
      | "comment"
      | "vehicleOwnerType"
      | "fundId"
      | "amount"
    >
  : V extends "_minimal"
  ? Pick<ClaimResponsibleForDamage, "id" | "party">
  : V extends "claimResponsibleForDamage-view"
  ? Pick<
      ClaimResponsibleForDamage,
      | "id"
      | "partyType"
      | "declaredToOrganization"
      | "supervisoryAuthorityConclusionDate"
      | "supervisoryAuthorityConclusionNumber"
      | "comment"
      | "vehicleOwnerType"
      | "fundId"
      | "amount"
      | "party"
    >
  : never;
