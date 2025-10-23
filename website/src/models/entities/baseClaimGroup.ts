import { AbstractGroup } from "./base/AbstractGroup";
import { Claim } from "./baseClaim";
export class ClaimGroup extends AbstractGroup {
  static NAME = "baseClaimGroup";
  list?: Claim[] | null;
}
export type ClaimGroupViewName = "_base" | "_local" | "_minimal";
export type ClaimGroupView<V extends ClaimGroupViewName> = V extends "_base"
  ? Pick<ClaimGroup, "id" | "legacyId" | "fundId">
  : V extends "_local"
  ? Pick<ClaimGroup, "id" | "legacyId" | "fundId">
  : V extends "_minimal"
  ? Pick<ClaimGroup, "id">
  : never;
