import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { ContractExt } from "./base$ContractExt";
import { Party } from "./base/base$Party";
export class ContractExtBeneficiary extends BaseUuidEntity {
  static NAME = "ContractExtBeneficiary";
  contractExt?: ContractExt | null;
  beneficiary?: Party | null;
}
export type ContractExtBeneficiaryViewName = "_base" | "_local" | "_minimal";
export type ContractExtBeneficiaryView<
  V extends ContractExtBeneficiaryViewName
> = V extends "_base"
  ? Pick<ContractExtBeneficiary, "id" | "contractExt">
  : V extends "_minimal"
  ? Pick<ContractExtBeneficiary, "id" | "contractExt">
  : never;
