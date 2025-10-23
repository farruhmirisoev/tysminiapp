import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class InsuranceRiskGroup extends BaseIntegerIdEntity {
  static NAME = "insurance_InsuranceRiskGroup";
  name?: string | null;
  nameUz?: string | null;
  description?: string | null;
  descriptionUz?: string | null;
}
export type InsuranceRiskGroupViewName = "_base" | "_local" | "_minimal";
export type InsuranceRiskGroupView<V extends InsuranceRiskGroupViewName> =
  V extends "_base"
    ? Pick<
        InsuranceRiskGroup,
        "id" | "name" | "nameUz" | "description" | "descriptionUz"
      >
    : V extends "_local"
    ? Pick<
        InsuranceRiskGroup,
        "id" | "name" | "nameUz" | "description" | "descriptionUz"
      >
    : V extends "_minimal"
    ? Pick<InsuranceRiskGroup, "id" | "name">
    : never;
