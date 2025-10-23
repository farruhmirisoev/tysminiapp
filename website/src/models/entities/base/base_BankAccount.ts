import { StandardEntity } from "./sys$StandardEntity";
import { Bank } from "./base$Bank";
import { DicCurrency } from "./base$DicCurrency";
import { Party } from "./base$Party";
import { Organization } from "./base$Organization";
export class BankAccount extends StandardEntity {
  static NAME = "base_BankAccount";
  name?: string | null;
  bank?: Bank | null;
  number?: string | null;
  currency?: DicCurrency | null;
  comment?: string | null;
  party?: Party | null;
  organization?: Organization | null;
}
export type BankAccountViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "bankAccount-browse"
  | "bankAccount-edit"
  | "bankAccount-view";
export type BankAccountView<V extends BankAccountViewName> = V extends "_base"
  ? Pick<BankAccount, "id" | "number" | "bank" | "name" | "comment">
  : V extends "_local"
  ? Pick<BankAccount, "id" | "name" | "number" | "comment">
  : V extends "_minimal"
  ? Pick<BankAccount, "id" | "number" | "bank">
  : V extends "bankAccount-browse"
  ? Pick<
      BankAccount,
      "id" | "number" | "bank" | "name" | "comment" | "party" | "bank"
    >
  : V extends "bankAccount-edit"
  ? Pick<
      BankAccount,
      "id" | "number" | "bank" | "name" | "comment" | "party" | "bank"
    >
  : V extends "bankAccount-view"
  ? Pick<
      BankAccount,
      | "id"
      | "name"
      | "number"
      | "comment"
      | "currency"
      | "party"
      | "organization"
    >
  : never;
