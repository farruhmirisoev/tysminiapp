import { Party } from "./base$Party";
export class Individual extends Party {
  static NAME = "base$Individual";
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
  entrepreneur?: boolean | null;
  patentNumber?: string | null;
  patentNumberRegistry?: string | null;
  patentDate?: any | null;
  patentEnd?: any | null;
  patentIssuedBy?: string | null;
}
export type IndividualViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "individual-view";
export type IndividualView<V extends IndividualViewName> = V extends "_base"
  ? Pick<
      Individual,
      | "id"
      | "name"
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
      | "entrepreneur"
      | "patentNumber"
      | "patentNumberRegistry"
      | "patentDate"
      | "patentEnd"
      | "patentIssuedBy"
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
      Individual,
      | "id"
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
      | "entrepreneur"
      | "patentNumber"
      | "patentNumberRegistry"
      | "patentDate"
      | "patentEnd"
      | "patentIssuedBy"
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
  ? Pick<Individual, "id" | "name">
  : V extends "individual-view"
  ? Pick<
      Individual,
      | "id"
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
      | "entrepreneur"
      | "patentNumber"
      | "patentNumberRegistry"
      | "patentDate"
      | "patentEnd"
      | "patentIssuedBy"
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
      | "user"
      | "attachments"
      | "country"
      | "region"
      | "district"
    >
  : never;
