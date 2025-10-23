import { AbstractDictionary } from "./base/AbstractDictionary";
import { GrantTypeSolver } from "./productGrantTypeSolver";
export class GrantType extends AbstractDictionary {
  static NAME = "productGrantType";
  solvers?: GrantTypeSolver[] | null;
}
export type GrantTypeViewName = "_base" | "_local" | "_minimal";
export type GrantTypeView<V extends GrantTypeViewName> = V extends "_base"
  ? Pick<
      GrantType,
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
      GrantType,
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
  ? Pick<GrantType, "id" | "langValue">
  : never;
