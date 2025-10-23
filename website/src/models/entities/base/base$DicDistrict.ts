import { AbstractDictionary } from "./AbstractDictionary";
import { DicCountry } from "./base$DicCountry";
import { DicRegion } from "./base$DicRegion";
export class DicDistrict extends AbstractDictionary {
  static NAME = "base$DicDistrict";
  country?: DicCountry | null;
  latitude?: any | null;
  longitude?: any | null;
  region?: DicRegion | null;
}
export type DicDistrictViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "dicCity.edit"
  | "dicCity.full";
export type DicDistrictView<V extends DicDistrictViewName> = V extends "_base"
  ? Pick<
      DicDistrict,
      | "id"
      | "langValue"
      | "latitude"
      | "longitude"
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
      DicDistrict,
      | "id"
      | "latitude"
      | "longitude"
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
  ? Pick<DicDistrict, "id" | "langValue">
  : V extends "dicCity.edit"
  ? Pick<
      DicDistrict,
      | "id"
      | "latitude"
      | "longitude"
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
      | "country"
    >
  : V extends "dicCity.full"
  ? Pick<
      DicDistrict,
      | "id"
      | "latitude"
      | "longitude"
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
      | "region"
      | "country"
    >
  : never;
