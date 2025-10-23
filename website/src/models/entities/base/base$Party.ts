import { AbstractParty } from "./AbstractParty";
import { DicCountry } from "./base$DicCountry";
import { DicRegion } from "./base$DicRegion";
import { DicDistrict } from "./base$DicDistrict";
import { UserExt } from "./base$UserExt";
import { ContactInfo } from "./base$ContactInfo";
import { BankAccount } from "./base_BankAccount";
import { Attachment } from "./base$Attachment";
import { Contract } from "./base$Contract";
export class Party extends AbstractParty {
  static NAME = "base$Party";
  country?: DicCountry | null;
  region?: DicRegion | null;
  district?: DicDistrict | null;
  street?: string | null;
  house?: string | null;
  apartment?: string | null;
  additionalInformation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  user?: UserExt | null;
  contactInfo?: ContactInfo[] | null;
  accounts?: BankAccount[] | null;
  attachments?: Attachment[] | null;
  contracts?: Contract[] | null;
}
export type PartyViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "party-base-browse"
  | "party-base-edit";
export type PartyView<V extends PartyViewName> = V extends "_base"
  ? Pick<
      Party,
      | "id"
      | "name"
      | "street"
      | "house"
      | "apartment"
      | "additionalInformation"
      | "phone"
      | "fax"
      | "email"
      | "legacyId"
      | "fundId"
      | "partyType"
      | "nationalIdentifier"
      | "active"
      | "resident"
      | "comment"
    >
  : V extends "_local"
  ? Pick<
      Party,
      | "id"
      | "street"
      | "house"
      | "apartment"
      | "additionalInformation"
      | "phone"
      | "fax"
      | "email"
      | "legacyId"
      | "fundId"
      | "name"
      | "partyType"
      | "nationalIdentifier"
      | "active"
      | "resident"
      | "comment"
    >
  : V extends "_minimal"
  ? Pick<Party, "id" | "name">
  : V extends "party-base-browse"
  ? Pick<
      Party,
      | "id"
      | "name"
      | "street"
      | "house"
      | "apartment"
      | "additionalInformation"
      | "phone"
      | "fax"
      | "email"
      | "legacyId"
      | "fundId"
      | "partyType"
      | "nationalIdentifier"
      | "active"
      | "resident"
      | "comment"
      | "residenceCountry"
      | "clientStatus"
    >
  : V extends "party-base-edit"
  ? Pick<
      Party,
      | "id"
      | "name"
      | "street"
      | "house"
      | "apartment"
      | "additionalInformation"
      | "phone"
      | "fax"
      | "email"
      | "legacyId"
      | "fundId"
      | "partyType"
      | "nationalIdentifier"
      | "active"
      | "resident"
      | "comment"
      | "residenceCountry"
      | "clientStatus"
      | "image"
      | "contactInfo"
      | "accounts"
      // | "responsible"
    >
  : never;
