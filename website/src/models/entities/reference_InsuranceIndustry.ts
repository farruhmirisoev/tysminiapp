import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class InsuranceIndustry extends BaseIntegerIdEntity {
  static NAME = "reference_InsuranceIndustry";
  name?: string | null;
}
export type InsuranceIndustryViewName = "_base" | "_local" | "_minimal";
export type InsuranceIndustryView<V extends InsuranceIndustryViewName> =
  V extends "_base"
    ? Pick<InsuranceIndustry, "id" | "name">
    : V extends "_local"
    ? Pick<InsuranceIndustry, "id" | "name">
    : V extends "_minimal"
    ? Pick<InsuranceIndustry, "id" | "name">
    : never;
