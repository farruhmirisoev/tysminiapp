import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class InsuranceClass extends BaseIntegerIdEntity {
  static NAME = "reference_InsuranceClass";
  code?: string | null;
  name?: string | null;
  nameUz?: string | null;
}
export type InsuranceClassViewName = "_base" | "_local" | "_minimal";
export type InsuranceClassView<V extends InsuranceClassViewName> =
  V extends "_base"
    ? Pick<InsuranceClass, "id" | "code" | "name" | "nameUz">
    : V extends "_local"
    ? Pick<InsuranceClass, "id" | "code" | "name" | "nameUz">
    : V extends "_minimal"
    ? Pick<InsuranceClass, "id" | "code" | "name">
    : never;
