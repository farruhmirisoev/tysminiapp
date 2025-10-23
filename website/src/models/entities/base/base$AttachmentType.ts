import { AbstractDictionary } from "./AbstractDictionary";
import { DicAttachedDocType } from "./base$DicAttachedDocType";
export class AttachmentType extends AbstractDictionary {
  static NAME = "base$AttachmentType";
  docCategory?: any | null;
  docType?: DicAttachedDocType | null;
  hasSeries?: boolean | null;
  hasNumber?: boolean | null;
  hasAuthority?: boolean | null;
  hasDate?: boolean | null;
}
export type AttachmentTypeViewName = "_base" | "_local" | "_minimal";
export type AttachmentTypeView<V extends AttachmentTypeViewName> =
  V extends "_base"
    ? Pick<
        AttachmentType,
        | "id"
        | "langValue"
        | "docCategory"
        | "hasSeries"
        | "hasNumber"
        | "hasAuthority"
        | "hasDate"
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
        AttachmentType,
        | "id"
        | "docCategory"
        | "hasSeries"
        | "hasNumber"
        | "hasAuthority"
        | "hasDate"
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
    ? Pick<AttachmentType, "id" | "langValue">
    : never;
