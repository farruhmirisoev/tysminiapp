import { AbstractDictionary } from "./base/AbstractDictionary";
export class InsuredObjectType extends AbstractDictionary {
  static NAME = "reference_InsuredObjectType";
}
export type InsuredObjectTypeViewName = "_base" | "_local" | "_minimal";
export type InsuredObjectTypeView<V extends InsuredObjectTypeViewName> =
  V extends "_base"
    ? Pick<
        InsuredObjectType,
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
        InsuredObjectType,
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
    ? Pick<InsuredObjectType, "id" | "langValue">
    : never;
