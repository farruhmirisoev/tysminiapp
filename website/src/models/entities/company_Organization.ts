import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class Organization extends BaseIntegerIdEntity {
  static NAME = "company_Organization";
  code?: string | null;
  organizationType?: number | null;
  inn?: string | null;
  name?: string | null;
  fullName?: string | null;
  oked?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  address?: string | null;
  document?: string | null;
  licenceNumber?: string | null;
  licenceDate?: any | null;
  comment?: string | null;
  parent?: Organization | null;
  order?: any | null;
  userpId?: number | null;
}
export type OrganizationViewName = "_base" | "_local" | "_minimal";
export type OrganizationView<V extends OrganizationViewName> = V extends "_base"
  ? Pick<
      Organization,
      | "id"
      | "name"
      | "code"
      | "organizationType"
      | "inn"
      | "fullName"
      | "oked"
      | "phone"
      | "fax"
      | "email"
      | "address"
      | "document"
      | "licenceNumber"
      | "licenceDate"
      | "comment"
      | "order"
      | "userpId"
    >
  : V extends "_local"
  ? Pick<
      Organization,
      | "id"
      | "code"
      | "organizationType"
      | "inn"
      | "name"
      | "fullName"
      | "oked"
      | "phone"
      | "fax"
      | "email"
      | "address"
      | "document"
      | "licenceNumber"
      | "licenceDate"
      | "comment"
      | "order"
      | "userpId"
    >
  : V extends "_minimal"
  ? Pick<Organization, "id" | "name">
  : never;
