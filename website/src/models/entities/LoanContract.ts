import { Contract } from "./base/base$Contract";
import { Party } from "./base/base$Party";
import { LoanType } from "./insurance_LoanType";
import { ContractExt } from "./base$ContractExt";
export class LoanContract extends Contract {
  static NAME = "LoanContract";
  borrowerType?: any | null;
  borrower?: Party | null;
  loanType?: LoanType | null;
  loanTotal?: any | null;
  loanAmount?: any | null;
  loanTerm?: number | null;
  objectTitle?: string | null;
  objectDescription?: string | null;
  contractExt?: ContractExt | null;
}
export type LoanContractViewName = "_base" | "_local" | "_minimal";
export type LoanContractView<V extends LoanContractViewName> = V extends "_base"
  ? Pick<
      LoanContract,
      | "id"
      | "contractNumber"
      | "borrowerType"
      | "loanTotal"
      | "loanAmount"
      | "loanTerm"
      | "objectTitle"
      | "objectDescription"
      | "legacyId"
      | "fundId"
      | "startDate"
      | "endDate"
      | "writeHistory"
      | "partyType"
      | "contractDate"
      | "contractStartDate"
      | "contractEndDate"
      | "description"
      | "fixDate"
    >
  : V extends "_local"
  ? Pick<
      LoanContract,
      | "id"
      | "borrowerType"
      | "loanTotal"
      | "loanAmount"
      | "loanTerm"
      | "objectTitle"
      | "objectDescription"
      | "legacyId"
      | "fundId"
      | "startDate"
      | "endDate"
      | "writeHistory"
      | "partyType"
      | "contractNumber"
      | "contractDate"
      | "contractStartDate"
      | "contractEndDate"
      | "description"
      | "fixDate"
    >
  : V extends "_minimal"
  ? Pick<LoanContract, "id" | "contractNumber">
  : never;
