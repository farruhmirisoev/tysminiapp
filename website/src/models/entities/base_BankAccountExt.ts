import { BankAccount } from "./base/base_BankAccount";
import { AccountChart } from "./accounting$AccountChart";
export class BankAccountExt extends BankAccount {
  static NAME = "base_BankAccountExt";
  accountChart?: AccountChart | null;
}
export type BankAccountExtViewName = "_base" | "_local" | "_minimal";
export type BankAccountExtView<V extends BankAccountExtViewName> =
  V extends "_base"
    ? Pick<BankAccountExt, "id" | "number" | "bank" | "name" | "comment">
    : V extends "_local"
    ? Pick<BankAccountExt, "id" | "name" | "number" | "comment">
    : V extends "_minimal"
    ? Pick<BankAccountExt, "id" | "number" | "bank">
    : never;
