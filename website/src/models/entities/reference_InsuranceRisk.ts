import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { InsuranceRiskGroup } from "./insurance_InsuranceRiskGroup";
import { Product } from "./product_Product";
export class InsuranceRisk extends BaseIntegerIdEntity {
  static NAME = "reference_InsuranceRisk";
  group?: InsuranceRiskGroup | null;
  name?: string | null;
  nameUz?: string | null;
  description?: string | null;
  descriptionUz?: string | null;
  products?: Product[] | null;
}
export type InsuranceRiskViewName = "_base" | "_local" | "_minimal";
export type InsuranceRiskView<V extends InsuranceRiskViewName> =
  V extends "_base"
    ? Pick<
        InsuranceRisk,
        "id" | "name" | "nameUz" | "description" | "descriptionUz"
      >
    : V extends "_local"
    ? Pick<
        InsuranceRisk,
        "id" | "name" | "nameUz" | "description" | "descriptionUz"
      >
    : V extends "_minimal"
    ? Pick<InsuranceRisk, "id" | "name">
    : never;
