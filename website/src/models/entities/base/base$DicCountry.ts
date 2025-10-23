import { AbstractDictionary } from "./AbstractDictionary";
import { DicRegion } from "./base$DicRegion";
export class DicCountry extends AbstractDictionary {
  static NAME = "base$DicCountry";
  regions?: DicRegion[] | null;
}
export type DicCountryViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "dicCountry.full.edit";
export type DicCountryView<V extends DicCountryViewName> = V extends "_base"
  ? Pick<
      DicCountry,
      | "id"
      | "langValue"
      | "legacyId"
      | "fundId"
      | "langValue1"
      | "description1"
      | "langValue2"
      | "description2"
      | "langValue3"
      | "description3"
      | "langValue4"
      | "description4"
      | "langValue5"
      | "description5"
      | "startDate"
      | "endDate"
      | "code"
      | "isSystemRecord"
      | "active"
      | "isDefault"
      | "order"
    >
  : V extends "_local"
  ? Pick<
      DicCountry,
      | "id"
      | "legacyId"
      | "fundId"
      | "langValue1"
      | "description1"
      | "langValue2"
      | "description2"
      | "langValue3"
      | "description3"
      | "langValue4"
      | "description4"
      | "langValue5"
      | "description5"
      | "startDate"
      | "endDate"
      | "code"
      | "isSystemRecord"
      | "active"
      | "isDefault"
      | "order"
    >
  : V extends "_minimal"
  ? Pick<DicCountry, "id" | "langValue">
  : V extends "dicCountry.full.edit"
  ? Pick<
      DicCountry,
      | "id"
      | "legacyId"
      | "fundId"
      | "langValue1"
      | "description1"
      | "langValue2"
      | "description2"
      | "langValue3"
      | "description3"
      | "langValue4"
      | "description4"
      | "langValue5"
      | "description5"
      | "startDate"
      | "endDate"
      | "code"
      | "isSystemRecord"
      | "active"
      | "isDefault"
      | "order"
      | "regions"
    >
  : never;
