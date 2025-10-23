import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { ContractExt } from "./base$ContractExt";
import { InsuranceType } from "./reference_InsuranceType";
export class ContractExtInsuranceType extends BaseUuidEntity {
  static NAME = "ContractExtInsuranceType";
  contractExt?: ContractExt | null;
  insuranceType?: InsuranceType | null;
  start?: any | null;
  end?: any | null;
  liabilitySum?: any | null;
  premiumSum?: any | null;
}
export type ContractExtInsuranceTypeViewName = "_base" | "_local" | "_minimal";
export type ContractExtInsuranceTypeView<
  V extends ContractExtInsuranceTypeViewName
> = V extends "_base"
  ? Pick<
      ContractExtInsuranceType,
      "id" | "start" | "end" | "liabilitySum" | "premiumSum"
    >
  : V extends "_local"
  ? Pick<
      ContractExtInsuranceType,
      "id" | "start" | "end" | "liabilitySum" | "premiumSum"
    >
  : V extends "_minimal"
  ? Pick<ContractExtInsuranceType, "id">
  : never;
