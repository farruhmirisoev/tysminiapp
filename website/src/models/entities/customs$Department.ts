import { AbstractDictionary } from "./base/AbstractDictionary";
export class CustomsDepartment extends AbstractDictionary {
  static NAME = "customs$Department";
}
export type CustomsDepartmentViewName = "_base" | "_local" | "_minimal";
export type CustomsDepartmentView<V extends CustomsDepartmentViewName> =
  V extends "_base"
    ? Pick<
        CustomsDepartment,
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
        CustomsDepartment,
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
    ? Pick<CustomsDepartment, "id" | "langValue">
    : never;
