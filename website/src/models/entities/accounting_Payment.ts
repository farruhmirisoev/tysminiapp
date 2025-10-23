import { StandardEntity } from "./base/sys$StandardEntity";
import { PaymentType, PaymentState } from "../enums/enums";
import { OrganizationExt } from "./base$OrganizationExt";
import { BankAccount } from "./base/base_BankAccount";
import { Bank } from "./base/base$Bank";
import { Party } from "./base/base$Party";
import { DicCurrency } from "./base/base$DicCurrency";
import { AccountStatement } from "./accounting_AccountStatement";
export class Payment extends StandardEntity {
  static NAME = "accounting_Payment";
  paymentType?: PaymentType | null;
  organizationExt?: OrganizationExt | null;
  organizationAccount?: BankAccount | null;
  documentNumber?: string | null;
  documentDate?: any | null;
  bankCode?: string | null;
  bank?: Bank | null;
  account?: string | null;
  inn?: string | null;
  name?: string | null;
  client?: Party | null;
  clientAccount?: BankAccount | null;
  purpose?: string | null;
  currency?: DicCurrency | null;
  income?: any | null;
  outcome?: any | null;
  comment?: string | null;
  accountStatement?: AccountStatement | null;
  state?: PaymentState | null;
  errorMessage?: string | null;
  userpId?: any | null;
}
export type PaymentViewName = "_base" | "_local" | "_minimal" | "payment-view";
export type PaymentView<V extends PaymentViewName> = V extends "_base"
  ? Pick<
      Payment,
      | "id"
      | "account"
      | "paymentType"
      | "documentNumber"
      | "documentDate"
      | "bankCode"
      | "inn"
      | "name"
      | "purpose"
      | "income"
      | "outcome"
      | "comment"
      | "state"
      | "errorMessage"
      | "userpId"
    >
  : V extends "_local"
  ? Pick<
      Payment,
      | "id"
      | "paymentType"
      | "documentNumber"
      | "documentDate"
      | "bankCode"
      | "account"
      | "inn"
      | "name"
      | "purpose"
      | "income"
      | "outcome"
      | "comment"
      | "state"
      | "errorMessage"
      | "userpId"
    >
  : V extends "_minimal"
  ? Pick<Payment, "id" | "account">
  : V extends "payment-view"
  ? Pick<
      Payment,
      | "id"
      | "paymentType"
      | "documentNumber"
      | "documentDate"
      | "bankCode"
      | "account"
      | "inn"
      | "name"
      | "purpose"
      | "income"
      | "outcome"
      | "comment"
      | "state"
      | "errorMessage"
      | "userpId"
      | "currency"
      | "client"
      | "organizationExt"
      | "organizationAccount"
      | "clientAccount"
    >
  : never;
