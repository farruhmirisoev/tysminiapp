import { StandardEntity } from "./base/sys$StandardEntity";
import { OrganizationExt } from "./base$OrganizationExt";
import { BankAccount } from "./base/base_BankAccount";
import { Payment } from "./accounting_Payment";
export class AccountStatement extends StandardEntity {
  static NAME = "accounting_AccountStatement";
  organizationExt?: OrganizationExt | null;
  account?: BankAccount | null;
  date?: any | null;
  amountBegin?: any | null;
  sumIn?: any | null;
  sumOut?: any | null;
  amountEnd?: any | null;
  payments?: Payment[] | null;
}
export type AccountStatementViewName = "_base" | "_local" | "_minimal";
export type AccountStatementView<V extends AccountStatementViewName> =
  V extends "_base"
    ? Pick<
        AccountStatement,
        "id" | "date" | "amountBegin" | "sumIn" | "sumOut" | "amountEnd"
      >
    : V extends "_local"
    ? Pick<
        AccountStatement,
        "id" | "date" | "amountBegin" | "sumIn" | "sumOut" | "amountEnd"
      >
    : V extends "_minimal"
    ? Pick<AccountStatement, "id" | "date">
    : never;
