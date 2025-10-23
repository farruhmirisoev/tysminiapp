import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
export class SCountry extends BaseLongIdEntity {
  static NAME = "insurance_SCountry";
  kod?: string | null;
  name?: string | null;
  nameShort?: string | null;
}
export type SCountryViewName = "_base" | "_local" | "_minimal";
export type SCountryView<V extends SCountryViewName> = V extends "_base"
  ? Pick<SCountry, "id" | "name" | "kod" | "nameShort">
  : V extends "_local"
  ? Pick<SCountry, "id" | "kod" | "name" | "nameShort">
  : V extends "_minimal"
  ? Pick<SCountry, "id" | "name">
  : never;
