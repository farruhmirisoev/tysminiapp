import { StandardEntity } from "./base/sys$StandardEntity";
import { Policy } from "./base$Policy";
import { Claim } from "./baseClaim";
export class ClaimPolicy extends StandardEntity {
  static NAME = "ClaimPolicy";
  policy?: Policy | null;
  series?: string | null;
  number?: any | null;
  givenDate?: any | null;
  begin?: any | null;
  end?: any | null;
  liability?: any | null;
  premium?: any | null;
  claim?: Claim | null;
}
export type ClaimPolicyViewName = "_base" | "_local" | "_minimal";
export type ClaimPolicyView<V extends ClaimPolicyViewName> = V extends "_base"
  ? Pick<
      ClaimPolicy,
      | "id"
      | "series"
      | "number"
      | "givenDate"
      | "begin"
      | "end"
      | "liability"
      | "premium"
    >
  : V extends "_local"
  ? Pick<
      ClaimPolicy,
      | "id"
      | "series"
      | "number"
      | "givenDate"
      | "begin"
      | "end"
      | "liability"
      | "premium"
    >
  : V extends "_minimal"
  ? Pick<ClaimPolicy, "id" | "series" | "number">
  : never;
