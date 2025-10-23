import { AbstractDictionary } from "./AbstractDictionary";
export class DicOked extends AbstractDictionary {
  static NAME = "base$DicOked";
}
export type DicOkedViewName = "_base" | "_local" | "_minimal";
export type DicOkedView<V extends DicOkedViewName> = V extends "_base"
  ? Pick<
      DicOked,
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
      DicOked,
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
  ? Pick<DicOked, "id" | "langValue">
  : never;
