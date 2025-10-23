import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { InsurProd } from "./insurance_InsurProd";
export class InsurProdBranch extends BaseUuidEntity {
  static NAME = "insurance_InsurProdBranch";
  branch?: number | null;
  idInsurProd?: InsurProd | null;
  idSConfirm?: number | null;
  maxInsurKom?: any | null;
  maxInsurSumma?: any | null;
}
export type InsurProdBranchViewName = "_base" | "_local" | "_minimal";
export type InsurProdBranchView<V extends InsurProdBranchViewName> =
  V extends "_base"
    ? Pick<
        InsurProdBranch,
        "id" | "branch" | "idSConfirm" | "maxInsurKom" | "maxInsurSumma"
      >
    : V extends "_local"
    ? Pick<
        InsurProdBranch,
        "id" | "branch" | "idSConfirm" | "maxInsurKom" | "maxInsurSumma"
      >
    : never;
