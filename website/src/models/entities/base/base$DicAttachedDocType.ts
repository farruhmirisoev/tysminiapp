import { AbstractDictionary } from "./AbstractDictionary";
export class DicAttachedDocType extends AbstractDictionary {
  static NAME = "base$DicAttachedDocType";
}
export type DicAttachedDocTypeViewName = "_base" | "_local" | "_minimal";
export type DicAttachedDocTypeView<V extends DicAttachedDocTypeViewName> =
  V extends "_base"
    ? Pick<
        DicAttachedDocType,
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
        DicAttachedDocType,
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
    ? Pick<DicAttachedDocType, "id" | "langValue">
    : never;
