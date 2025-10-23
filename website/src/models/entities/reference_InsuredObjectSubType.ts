import { AbstractDictionary } from "./base/AbstractDictionary";
import { InsuredObjectType } from "./reference_InsuredObjectType";
export class InsuredObjectSubType extends AbstractDictionary {
  static NAME = "reference_InsuredObjectSubType";
  type?: InsuredObjectType | null;
}
export type InsuredObjectSubTypeViewName = "_base" | "_local" | "_minimal";
export type InsuredObjectSubTypeView<V extends InsuredObjectSubTypeViewName> =
  V extends "_base"
    ? Pick<
        InsuredObjectSubType,
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
        InsuredObjectSubType,
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
    ? Pick<InsuredObjectSubType, "id" | "langValue">
    : never;
