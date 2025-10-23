import { Organization } from "./base/base$Organization";
export class OrganizationExt extends Organization {
  static NAME = "base$OrganizationExt";
  shortName?: string | null;
  chiefName?: string | null;
  accountantName?: string | null;
}
export type OrganizationExtViewName = "_base" | "_local" | "_minimal";
export type OrganizationExtView<V extends OrganizationExtViewName> =
  V extends "_base"
    ? Pick<
        OrganizationExt,
        | "id"
        | "name"
        | "shortName"
        | "chiefName"
        | "accountantName"
        | "legacyId"
        | "fundId"
        | "partyType"
        | "nationalIdentifier"
        | "active"
        | "resident"
        | "comment"
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
      >
    : V extends "_local"
    ? Pick<
        OrganizationExt,
        | "id"
        | "shortName"
        | "chiefName"
        | "accountantName"
        | "legacyId"
        | "fundId"
        | "name"
        | "partyType"
        | "nationalIdentifier"
        | "active"
        | "resident"
        | "comment"
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
      >
    : V extends "_minimal"
    ? Pick<OrganizationExt, "id" | "name">
    : never;
