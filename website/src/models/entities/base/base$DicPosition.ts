import { AbstractDictionary } from "./AbstractDictionary";
export class DicPosition extends AbstractDictionary {
  static NAME = "base$DicPosition";
}
export type DicPositionViewName = "_base" | "_local" | "_minimal";
export type DicPositionView<V extends DicPositionViewName> = V extends "_base"
  ? Pick<
      DicPosition,
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
      DicPosition,
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
  ? Pick<DicPosition, "id" | "langValue">
  : never;
