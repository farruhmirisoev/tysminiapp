import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { Product } from "./product_Product";
import { InsuranceType } from "./reference_InsuranceType";
import { InsuredObjectType } from "./reference_InsuredObjectType";
import { InsuredObjectSubType } from "./reference_InsuredObjectSubType";
export class ProductType extends BaseIntegerIdEntity {
  static NAME = "product_Type";
  product?: Product | null;
  insuranceType?: InsuranceType | null;
  insuredObjectType?: InsuredObjectType | null;
  insuredObjectSubType?: InsuredObjectSubType | null;
  name?: string | null;
  partLiability?: any | null;
  partPremium?: any | null;
  deleteTs?: any | null;
  deletedBy?: string | null;
}
export type ProductTypeViewName = "_base" | "_local" | "_minimal";
export type ProductTypeView<V extends ProductTypeViewName> = V extends "_base"
  ? Pick<
      ProductType,
      | "id"
      | "product"
      | "insuranceType"
      | "name"
      | "partLiability"
      | "partPremium"
    >
  : V extends "_local"
  ? Pick<ProductType, "id" | "name" | "partLiability" | "partPremium">
  : V extends "_minimal"
  ? Pick<ProductType, "id" | "product" | "insuranceType">
  : never;
