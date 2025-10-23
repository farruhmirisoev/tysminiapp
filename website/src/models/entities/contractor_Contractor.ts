import { Correspondent } from "./contractor_Correspondent";
export class Contractor extends Correspondent {
  static NAME = "contractor_Contractor";
  inn?: string | null;
  countryId?: number | null;
  regionId?: number | null;
  districtId?: number | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  fax?: string | null;
  resident?: boolean | null;
  isAgent?: boolean | null;
  website?: string | null;
  comment?: string | null;
  fixData?: boolean | null;
  fixTime?: any | null;
  fullAddress?: string | null;
}
export type ContractorViewName = "_base" | "_local" | "_minimal";
export type ContractorView<V extends ContractorViewName> = V extends "_base"
  ? Pick<
      Contractor,
      | "id"
      | "name"
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
      | "userpId"
    >
  : V extends "_local"
  ? Pick<
      Contractor,
      | "id"
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
      | "name"
      | "userpId"
    >
  : V extends "_minimal"
  ? Pick<Contractor, "id" | "name">
  : never;
