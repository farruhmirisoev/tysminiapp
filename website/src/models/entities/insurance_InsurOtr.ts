import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class InsurOtr extends BaseIntegerIdEntity {
  static NAME = "insurance_InsurOtr";
  name?: string | null;
}
export type InsurOtrViewName = "_base" | "_local" | "_minimal";
export type InsurOtrView<V extends InsurOtrViewName> = V extends "_base"
  ? Pick<InsurOtr, "id" | "name">
  : V extends "_local"
  ? Pick<InsurOtr, "id" | "name">
  : V extends "_minimal"
  ? Pick<InsurOtr, "id" | "name">
  : never;
