import { StandardEntity } from "./base/sys$StandardEntity";
import { IncidentFrequency } from "./reference_OsgoIncidentFrequency1";
import { Relative } from "./insurance_Relative1";
import { Osgo } from "./osgo_Osgo";
export class Driver extends StandardEntity {
  static NAME = "osgoDriverOld";
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  gender?: any | null;
  pinfl?: string | null;
  countryId?: number | null;
  regionId?: number | null;
  districtId?: number | null;
  address?: string | null;
  incidentFrequency?: IncidentFrequency | null;
  birthDate?: any | null;
  licenseSeries?: string | null;
  licenseNumber?: string | null;
  licenseDate?: any | null;
  passportSeries?: string | null;
  passportNumber?: string | null;
  passportIssueDate?: any | null;
  passportIssuedBy?: string | null;
  relative?: Relative | null;
  osgo?: Osgo | null;
  fixData?: boolean | null;
  fullName?: string | null;
  fullLicense?: string | null;
  fullPassport?: string | null;
}
export type DriverViewName = "_base" | "_local" | "_minimal";
export type DriverView<V extends DriverViewName> = V extends "_base"
  ? Pick<
      Driver,
      | "id"
      | "fullName"
      | "incidentFrequency"
      | "firstName"
      | "lastName"
      | "middleName"
      | "gender"
      | "pinfl"
      | "countryId"
      | "regionId"
      | "districtId"
      | "address"
      | "birthDate"
      | "licenseSeries"
      | "licenseNumber"
      | "licenseDate"
      | "passportSeries"
      | "passportNumber"
      | "passportIssueDate"
      | "passportIssuedBy"
      | "fixData"
    >
  : V extends "_local"
  ? Pick<
      Driver,
      | "id"
      | "firstName"
      | "lastName"
      | "middleName"
      | "gender"
      | "pinfl"
      | "countryId"
      | "regionId"
      | "districtId"
      | "address"
      | "birthDate"
      | "licenseSeries"
      | "licenseNumber"
      | "licenseDate"
      | "passportSeries"
      | "passportNumber"
      | "passportIssueDate"
      | "passportIssuedBy"
      | "fixData"
    >
  : V extends "_minimal"
  ? Pick<Driver, "id" | "fullName" | "incidentFrequency">
  : never;
