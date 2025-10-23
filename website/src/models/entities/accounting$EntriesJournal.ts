import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { AccountChart } from "./accounting$AccountChart";
import { DicCurrency } from "./base/base$DicCurrency";
import { Party } from "./base/base$Party";
import { ContractExt } from "./base$ContractExt";
import { Policy } from "./base$Policy";
import { BankAccount } from "./base/base_BankAccount";
import { OrganizationExt } from "./base$OrganizationExt";
import { Person } from "./base/base$Person";
import { AgentAct } from "./agentact$AgentAct";
export class EntriesJournal extends BaseUuidEntity {
  static NAME = "accounting$EntriesJournal";
  date?: any | null;
  debit?: AccountChart | null;
  credit?: AccountChart | null;
  currencyDt?: DicCurrency | null;
  amountDt?: any | null;
  currencyKt?: DicCurrency | null;
  amountKt?: any | null;
  amount?: any | null;
  description?: string | null;
  documentId?: any | null;
  partyDt?: Party | null;
  contractDt?: ContractExt | null;
  policyDt?: Policy | null;
  bankAccountDt?: BankAccount | null;
  organizationDt?: OrganizationExt | null;
  personDt?: Person | null;
  agentActDt?: AgentAct | null;
  partyKt?: Party | null;
  contractKt?: ContractExt | null;
  policyKt?: Policy | null;
  bankAccountKt?: BankAccount | null;
  organizationKt?: OrganizationExt | null;
  personKt?: Person | null;
  agentActKt?: AgentAct | null;
}
export type EntriesJournalViewName = "_base" | "_local" | "_minimal";
export type EntriesJournalView<V extends EntriesJournalViewName> =
  V extends "_base"
    ? Pick<
        EntriesJournal,
        | "id"
        | "date"
        | "amountDt"
        | "amountKt"
        | "amount"
        | "description"
        | "documentId"
      >
    : V extends "_local"
    ? Pick<
        EntriesJournal,
        | "id"
        | "date"
        | "amountDt"
        | "amountKt"
        | "amount"
        | "description"
        | "documentId"
      >
    : V extends "_minimal"
    ? Pick<EntriesJournal, "id">
    : never;
