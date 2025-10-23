import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { SsBranchType } from "./insurance_SsBranchType";
export class Branch extends BaseIntegerIdEntity {
  static NAME = "insurance_Branch";
  acc?: string | null;
  address?: string | null;
  branchType?: SsBranchType | null;
  curDate?: any | null;
  doc?: string | null;
  email?: string | null;
  fax?: string | null;
  formDate?: any | null;
  header?: number | null;
  idSCountry?: any | null;
  idSPost?: number | null;
  idSResident?: number | null;
  idSStatus?: number | null;
  inn?: string | null;
  kod?: number | null;
  kodSoatoSRayobl?: string | null;
  licenceDate?: any | null;
  licenceNum?: string | null;
  mfo?: string | null;
  name?: string | null;
  okonh?: string | null;
  prevDate?: any | null;
  rukov?: string | null;
  shortName?: string | null;
  sort?: any | null;
  state?: number | null;
  tel?: string | null;
  union?: number | null;
  url?: string | null;
  legacyId?: any | null;
}
export type BranchViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "branch-import-view";
export type BranchView<V extends BranchViewName> = V extends "_base"
  ? Pick<
      Branch,
      | "id"
      | "name"
      | "acc"
      | "address"
      | "curDate"
      | "doc"
      | "email"
      | "fax"
      | "formDate"
      | "header"
      | "idSCountry"
      | "idSPost"
      | "idSResident"
      | "idSStatus"
      | "inn"
      | "kod"
      | "kodSoatoSRayobl"
      | "licenceDate"
      | "licenceNum"
      | "mfo"
      | "okonh"
      | "prevDate"
      | "rukov"
      | "shortName"
      | "sort"
      | "state"
      | "tel"
      | "union"
      | "url"
      | "legacyId"
    >
  : V extends "_local"
  ? Pick<
      Branch,
      | "id"
      | "acc"
      | "address"
      | "curDate"
      | "doc"
      | "email"
      | "fax"
      | "formDate"
      | "header"
      | "idSCountry"
      | "idSPost"
      | "idSResident"
      | "idSStatus"
      | "inn"
      | "kod"
      | "kodSoatoSRayobl"
      | "licenceDate"
      | "licenceNum"
      | "mfo"
      | "name"
      | "okonh"
      | "prevDate"
      | "rukov"
      | "shortName"
      | "sort"
      | "state"
      | "tel"
      | "union"
      | "url"
      | "legacyId"
    >
  : V extends "_minimal"
  ? Pick<Branch, "id" | "name">
  : V extends "branch-import-view"
  ? Pick<
      Branch,
      | "id"
      | "acc"
      | "address"
      | "curDate"
      | "doc"
      | "email"
      | "fax"
      | "formDate"
      | "header"
      | "idSCountry"
      | "idSPost"
      | "idSResident"
      | "idSStatus"
      | "inn"
      | "kod"
      | "kodSoatoSRayobl"
      | "licenceDate"
      | "licenceNum"
      | "mfo"
      | "name"
      | "okonh"
      | "prevDate"
      | "rukov"
      | "shortName"
      | "sort"
      | "state"
      | "tel"
      | "union"
      | "url"
      | "legacyId"
      | "branchType"
    >
  : never;
