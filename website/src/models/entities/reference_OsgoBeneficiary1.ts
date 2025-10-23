import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class Beneficiary extends BaseIntegerIdEntity {
  static NAME = "reference_OsgoBeneficiary1";
  name?: string | null;
  nameUz?: string | null;
  coefficient?: any | null;
  order?: number | null;
  fundId?: number | null;
}
export type BeneficiaryViewName = "_base" | "_local" | "_minimal";
export type BeneficiaryView<V extends BeneficiaryViewName> = V extends "_base"
  ? Pick<
      Beneficiary,
      "id" | "name" | "nameUz" | "coefficient" | "order" | "fundId"
    >
  : V extends "_local"
  ? Pick<
      Beneficiary,
      "id" | "name" | "nameUz" | "coefficient" | "order" | "fundId"
    >
  : V extends "_minimal"
  ? Pick<Beneficiary, "id" | "name">
  : never;
