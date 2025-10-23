import { AbstractParty } from "./AbstractParty";
import { DicOked } from "./base$DicOked";
import { DicPosition } from "./base$DicPosition";
import { OrganizationHierarchy } from "./base_OrganizationHierarchy";
import { BankAccount } from "./base_BankAccount";
import { Attachment } from "./base$Attachment";
import { DicCountry } from "./base$DicCountry";
import { DicRegion } from "./base$DicRegion";
import { DicDistrict } from "./base$DicDistrict";
export class Organization extends AbstractParty {
  static NAME = "base$Organization";
  code?: string | null;
  organizationType?: any | null;
  oked?: DicOked | null;
  position?: DicPosition | null;
  document?: string | null;
  licenceNumber?: string | null;
  licenceDate?: any | null;
  parent?: Organization | null;
  hierarchyList?: OrganizationHierarchy[] | null;
  order?: any | null;
  accounts?: BankAccount[] | null;
  attachments?: Attachment[] | null;
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
}
export type OrganizationViewName = "_base" | "_local" | "_minimal";
export type OrganizationView<V extends OrganizationViewName> = V extends "_base"
  ? Pick<
      Organization,
      | "id"
      | "name"
      | "code"
      | "organizationType"
      | "document"
      | "licenceNumber"
      | "licenceDate"
      | "order"
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
      Organization,
      | "id"
      | "code"
      | "organizationType"
      | "document"
      | "licenceNumber"
      | "licenceDate"
      | "order"
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
  ? Pick<Organization, "id" | "name">
  : never;
