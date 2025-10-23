import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SGrantType extends BaseIntegerIdEntity {
  static NAME = "insurance_SGrantType";
  name?: string | null;
}
export type SGrantTypeViewName = "_base" | "_local" | "_minimal";
export type SGrantTypeView<V extends SGrantTypeViewName> = V extends "_base"
  ? Pick<SGrantType, "id" | "name">
  : V extends "_local"
  ? Pick<SGrantType, "id" | "name">
  : V extends "_minimal"
  ? Pick<SGrantType, "id" | "name">
  : never;
