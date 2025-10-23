import { StandardEntity } from "./base/sys$StandardEntity";
import { DicCountry } from "./base/base$DicCountry";
import { DicRegion } from "./base/base$DicRegion";
import { DicDistrict } from "./base/base$DicDistrict";
export class ClaimDriver extends StandardEntity {
  static NAME = "ClaimDriver";
  driverNotFromPolicy?: boolean | null;
  driverFirstName?: string | null;
  driverLastName?: string | null;
  driverMiddleName?: string | null;
  driverPassportSeries?: string | null;
  driverPassportNumber?: string | null;
  driverCountry?: DicCountry | null;
  driverRegion?: DicRegion | null;
  driverDistrict?: DicDistrict | null;
  driverStreet?: string | null;
  driverAppartment?: string | null;
  driverFlat?: string | null;
  driverLicenseSeries?: string | null;
  driverLicenseNumber?: string | null;
  driverBirthday?: any | null;
  driverPhone?: string | null;
}
export type ClaimDriverViewName = "_base" | "_local" | "_minimal";
export type ClaimDriverView<V extends ClaimDriverViewName> = V extends "_base"
  ? Pick<
      ClaimDriver,
      | "id"
      | "driverNotFromPolicy"
      | "driverFirstName"
      | "driverLastName"
      | "driverMiddleName"
      | "driverPassportSeries"
      | "driverPassportNumber"
      | "driverStreet"
      | "driverAppartment"
      | "driverFlat"
      | "driverLicenseSeries"
      | "driverLicenseNumber"
      | "driverBirthday"
      | "driverPhone"
    >
  : V extends "_local"
  ? Pick<
      ClaimDriver,
      | "id"
      | "driverNotFromPolicy"
      | "driverFirstName"
      | "driverLastName"
      | "driverMiddleName"
      | "driverPassportSeries"
      | "driverPassportNumber"
      | "driverStreet"
      | "driverAppartment"
      | "driverFlat"
      | "driverLicenseSeries"
      | "driverLicenseNumber"
      | "driverBirthday"
      | "driverPhone"
    >
  : V extends "_minimal"
  ? Pick<ClaimDriver, "id">
  : never;
