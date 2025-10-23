import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class InsurProdMain extends BaseIntegerIdEntity {
  static NAME = "insurance_InsurProdMain";
  name?: string | null;
}
export type InsurProdMainViewName = "_base" | "_local" | "_minimal";
export type InsurProdMainView<V extends InsurProdMainViewName> =
  V extends "_base"
    ? Pick<InsurProdMain, "id" | "name">
    : V extends "_local"
    ? Pick<InsurProdMain, "id" | "name">
    : V extends "_minimal"
    ? Pick<InsurProdMain, "id" | "name">
    : never;
