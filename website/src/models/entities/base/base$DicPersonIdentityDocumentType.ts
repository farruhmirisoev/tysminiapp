import { AbstractDictionary } from "./AbstractDictionary";
export class DicPersonIdentityDocumentType extends AbstractDictionary {
  static NAME = "base$DicPersonIdentityDocumentType";
}
export type DicPersonIdentityDocumentTypeViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type DicPersonIdentityDocumentTypeView<
  V extends DicPersonIdentityDocumentTypeViewName
> = V extends "_base"
  ? Pick<
      DicPersonIdentityDocumentType,
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
      DicPersonIdentityDocumentType,
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
  ? Pick<DicPersonIdentityDocumentType, "id" | "langValue">
  : never;
