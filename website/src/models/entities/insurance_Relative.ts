import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class Relative extends BaseIntegerIdEntity {
  static NAME = "insurance_Relative";
  name?: string | null;
  nameUz?: string | null;
  fundId?: number | null;
}
export type RelativeViewName = "_base" | "_local" | "_minimal";
export type RelativeView<V extends RelativeViewName> = V extends "_base"
  ? Pick<Relative, "id" | "name" | "nameUz" | "fundId">
  : V extends "_local"
  ? Pick<Relative, "id" | "name" | "nameUz" | "fundId">
  : V extends "_minimal"
  ? Pick<Relative, "id" | "name">
  : never;
