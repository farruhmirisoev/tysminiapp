import { AbstractDictionary } from "./AbstractDictionary";
export class DicOrgLegalFormType extends AbstractDictionary {
  static NAME = "base$DicOrgLegalFormType";
}
export type DicOrgLegalFormTypeViewName = "_base" | "_local" | "_minimal";
export type DicOrgLegalFormTypeView<V extends DicOrgLegalFormTypeViewName> =
  V extends "_base"
    ? Pick<
        DicOrgLegalFormType,
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
        DicOrgLegalFormType,
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
    ? Pick<DicOrgLegalFormType, "id" | "langValue">
    : never;
