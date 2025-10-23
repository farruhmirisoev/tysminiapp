import { StandardEntity } from "./base/sys$StandardEntity";
import { Vehicle } from "./osgo_Vehicle";
import { Claim } from "./baseClaim";
export class ClaimObject extends StandardEntity {
  static NAME = "ClaimObject";
  vehicle?: Vehicle | null;
  claim?: Claim | null;
}
export type ClaimObjectViewName = "_base" | "_local" | "_minimal";
export type ClaimObjectView<V extends ClaimObjectViewName> = never;
