import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { ContractExt } from "./base$ContractExt";
import { InsuredObjectType } from "./reference_InsuredObjectType";
import { InsuredObjectSubType } from "./reference_InsuredObjectSubType";
import { PeriodInterval } from "../enums/enums";
export class ContractExtObject extends BaseUuidEntity {
  static NAME = "ContractExtObject";
  contractExt?: ContractExt | null;
  start?: any | null;
  end?: any | null;
  liabilitySum?: any | null;
  premiumSum?: any | null;
  type?: InsuredObjectType | null;
  subType?: InsuredObjectSubType | null;
  name?: string | null;
  brand?: string | null;
  tariffPeriod?: PeriodInterval | null;
  tariff?: any | null;
  description?: string | null;
}
export type ContractExtObjectViewName = "_base" | "_local" | "_minimal";
export type ContractExtObjectView<V extends ContractExtObjectViewName> =
  V extends "_base"
    ? Pick<
        ContractExtObject,
        | "id"
        | "name"
        | "start"
        | "end"
        | "liabilitySum"
        | "premiumSum"
        | "brand"
        | "tariffPeriod"
        | "tariff"
        | "description"
      >
    : V extends "_local"
    ? Pick<
        ContractExtObject,
        | "id"
        | "start"
        | "end"
        | "liabilitySum"
        | "premiumSum"
        | "name"
        | "brand"
        | "tariffPeriod"
        | "tariff"
        | "description"
      >
    : V extends "_minimal"
    ? Pick<ContractExtObject, "id" | "name">
    : never;
