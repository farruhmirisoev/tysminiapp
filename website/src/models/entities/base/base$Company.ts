import { Party } from "./base$Party";
import { DicOked } from "./base$DicOked";
import { DicOrgLegalFormType } from "./base$DicOrgLegalFormType";
export class Company extends Party {
  static NAME = "base$Company";
  account?: string | null;
  chiefName?: string | null;
  accountantName?: string | null;
  document?: string | null;
  oked?: DicOked | null;
  legalFormType?: DicOrgLegalFormType | null;
}
export type CompanyViewName = "_base" | "_local" | "_minimal" | "company-view";
export type CompanyView<V extends CompanyViewName> = V extends "_base"
  ? Pick<
      Company,
      | "id"
      | "name"
      | "account"
      | "chiefName"
      | "accountantName"
      | "document"
      | "legacyId"
      | "fundId"
      | "partyType"
      | "nationalIdentifier"
      | "active"
      | "resident"
      | "comment"
      | "street"
      | "house"
      | "apartment"
      | "additionalInformation"
      | "phone"
      | "fax"
      | "email"
    >
  : V extends "_local"
  ? Pick<
      Company,
      | "id"
      | "account"
      | "chiefName"
      | "accountantName"
      | "document"
      | "legacyId"
      | "fundId"
      | "name"
      | "partyType"
      | "nationalIdentifier"
      | "active"
      | "resident"
      | "comment"
      | "street"
      | "house"
      | "apartment"
      | "additionalInformation"
      | "phone"
      | "fax"
      | "email"
    >
  : V extends "_minimal"
  ? Pick<Company, "id" | "name">
  : V extends "company-view"
  ? Pick<
      Company,
      | "id"
      | "account"
      | "chiefName"
      | "accountantName"
      | "document"
      | "legacyId"
      | "fundId"
      | "name"
      | "partyType"
      | "nationalIdentifier"
      | "active"
      | "resident"
      | "comment"
      | "street"
      | "house"
      | "apartment"
      | "additionalInformation"
      | "phone"
      | "fax"
      | "email"
      | "attachments"
      | "country"
      | "region"
      | "district"
    >
  : never;
