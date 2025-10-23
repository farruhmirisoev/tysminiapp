import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { InsuranceIndustry } from "./reference_InsuranceIndustry";
import { InsuranceClass } from "./reference_InsuranceClass";
import { AccountGroup } from "../enums/enums";
import { ProductType } from "./product_Type";
import { ContractExtInsuranceType } from "./ContractExtInsuranceType";
export class InsuranceType extends BaseIntegerIdEntity {
  static NAME = "reference_InsuranceType";
  name?: string | null;
  insuranceIndustry?: InsuranceIndustry | null;
  insuranceClass?: InsuranceClass | null;
  accountGroup?: AccountGroup | null;
  mandatory?: boolean | null;
  products?: ProductType[] | null;
  contract?: ContractExtInsuranceType[] | null;
}
export type InsuranceTypeViewName = "_base" | "_local" | "_minimal";
export type InsuranceTypeView<V extends InsuranceTypeViewName> =
  V extends "_base"
    ? Pick<InsuranceType, "id" | "name" | "accountGroup" | "mandatory">
    : V extends "_local"
    ? Pick<InsuranceType, "id" | "name" | "accountGroup" | "mandatory">
    : V extends "_minimal"
    ? Pick<InsuranceType, "id" | "name">
    : never;
