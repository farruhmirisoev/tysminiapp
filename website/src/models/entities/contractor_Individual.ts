import { Contractor } from "./contractor_Contractor";
export class IndividualLegacy extends Contractor {
  static NAME = "contractor_Individual";
  pinfl?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  gender?: any | null;
  birthDate?: any | null;
  passportSeries?: string | null;
  passportNumber?: string | null;
  passportIssuedBy?: string | null;
  passportIssueDate?: any | null;
  activity?: string | null;
  user?: any | null;
}
export type IndividualLegacyViewName = "_base" | "_local" | "_minimal";
export type IndividualLegacyView<V extends IndividualLegacyViewName> =
  V extends "_base"
    ? Pick<
        IndividualLegacy,
        | "id"
        | "name"
        | "pinfl"
        | "lastName"
        | "firstName"
        | "middleName"
        | "gender"
        | "birthDate"
        | "passportSeries"
        | "passportNumber"
        | "passportIssuedBy"
        | "passportIssueDate"
        | "activity"
        | "user"
        | "userpId"
        | "inn"
        | "countryId"
        | "regionId"
        | "districtId"
        | "address"
        | "email"
        | "phone"
        | "fax"
        | "resident"
        | "isAgent"
        | "website"
        | "comment"
        | "fixData"
        | "fixTime"
      >
    : V extends "_local"
    ? Pick<
        IndividualLegacy,
        | "id"
        | "pinfl"
        | "lastName"
        | "firstName"
        | "middleName"
        | "gender"
        | "birthDate"
        | "passportSeries"
        | "passportNumber"
        | "passportIssuedBy"
        | "passportIssueDate"
        | "activity"
        | "user"
        | "name"
        | "userpId"
        | "inn"
        | "countryId"
        | "regionId"
        | "districtId"
        | "address"
        | "email"
        | "phone"
        | "fax"
        | "resident"
        | "isAgent"
        | "website"
        | "comment"
        | "fixData"
        | "fixTime"
      >
    : V extends "_minimal"
    ? Pick<IndividualLegacy, "id" | "name">
    : never;
