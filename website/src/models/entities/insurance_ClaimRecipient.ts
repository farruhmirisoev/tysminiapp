import { StandardEntity } from "./base/sys$StandardEntity";
import { Bank } from "./base/base$Bank";
import { Claim } from "./baseClaim";
export class ClaimRecipient extends StandardEntity {
  static NAME = "insurance_ClaimRecipient";
  partyType?: any | null;
  tin?: string | null;
  name?: string | null;
  amount?: any | null;
  bank?: Bank | null;
  account?: string | null;
  transitAccount?: string | null;
  cardNumber?: string | null;
  claim?: Claim | null;
}
export type ClaimRecipientViewName = "_base" | "_local" | "_minimal";
export type ClaimRecipientView<
  V extends ClaimRecipientViewName
> = V extends "_base"
  ? Pick<
      ClaimRecipient,
      | "id"
      | "name"
      | "partyType"
      | "tin"
      | "amount"
      | "account"
      | "transitAccount"
      | "cardNumber"
    >
  : V extends "_local"
  ? Pick<
      ClaimRecipient,
      | "id"
      | "partyType"
      | "tin"
      | "name"
      | "amount"
      | "account"
      | "transitAccount"
      | "cardNumber"
    >
  : V extends "_minimal"
  ? Pick<ClaimRecipient, "id" | "name">
  : never;
