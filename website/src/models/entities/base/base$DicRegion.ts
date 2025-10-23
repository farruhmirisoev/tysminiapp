import { AbstractDictionary } from "./AbstractDictionary";
import { DicCountry } from "./base$DicCountry";
import { DicDistrict } from "./base$DicDistrict";
export class DicRegion extends AbstractDictionary {
  static NAME = "base$DicRegion";
  country?: DicCountry | null;
  districts?: DicDistrict[] | null;
}
export type DicRegionViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "dicRegion.edit"
  | "dicRegion.full";
export type DicRegionView<V extends DicRegionViewName> = V extends "_base"
  ? Pick<
      DicRegion,
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
      DicRegion,
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
  ? Pick<DicRegion, "id" | "langValue">
  : V extends "dicRegion.edit"
  ? Pick<
      DicRegion,
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
      | "country"
    >
  : V extends "dicRegion.full"
  ? Pick<
      DicRegion,
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
      | "districts"
      | "country"
    >
  : never;
