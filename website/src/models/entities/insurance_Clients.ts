import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
export class Clients extends BaseLongIdEntity {
  static NAME = "insurance_Clients";
  acc?: string | null;
  address?: string | null;
  birthday?: any | null;
  doc?: string | null;
  email?: string | null;
  fax?: string | null;
  finUslug?: boolean | null;
  gosUch?: boolean | null;
  idSCountry?: any | null;
  idSOpf?: number | null;
  idSPost?: number | null;
  idSResident?: number | null;
  idSSex?: number | null;
  idSStatus?: number | null;
  inn?: string | null;
  kodSoatoSRayobl?: string | null;
  kommer?: boolean | null;
  kontakt?: string | null;
  kontaktDol?: string | null;
  malBiz?: boolean | null;
  mfo?: string | null;
  name?: string | null;
  okonh?: string | null;
  passwordDataVid?: any | null;
  passwordNum?: string | null;
  passwordSer?: string | null;
  passwordVidan?: string | null;
  rukov?: string | null;
  rw?: boolean | null;
  state?: number | null;
  tel?: string | null;
  url?: string | null;
  legacyId?: any | null;
}
export type ClientsViewName = "_base" | "_local" | "_minimal";
export type ClientsView<V extends ClientsViewName> = V extends "_base"
  ? Pick<
      Clients,
      | "id"
      | "name"
      | "acc"
      | "address"
      | "birthday"
      | "doc"
      | "email"
      | "fax"
      | "finUslug"
      | "gosUch"
      | "idSCountry"
      | "idSOpf"
      | "idSPost"
      | "idSResident"
      | "idSSex"
      | "idSStatus"
      | "inn"
      | "kodSoatoSRayobl"
      | "kommer"
      | "kontakt"
      | "kontaktDol"
      | "malBiz"
      | "mfo"
      | "okonh"
      | "passwordDataVid"
      | "passwordNum"
      | "passwordSer"
      | "passwordVidan"
      | "rukov"
      | "rw"
      | "state"
      | "tel"
      | "url"
      | "legacyId"
    >
  : V extends "_local"
  ? Pick<
      Clients,
      | "id"
      | "acc"
      | "address"
      | "birthday"
      | "doc"
      | "email"
      | "fax"
      | "finUslug"
      | "gosUch"
      | "idSCountry"
      | "idSOpf"
      | "idSPost"
      | "idSResident"
      | "idSSex"
      | "idSStatus"
      | "inn"
      | "kodSoatoSRayobl"
      | "kommer"
      | "kontakt"
      | "kontaktDol"
      | "malBiz"
      | "mfo"
      | "name"
      | "okonh"
      | "passwordDataVid"
      | "passwordNum"
      | "passwordSer"
      | "passwordVidan"
      | "rukov"
      | "rw"
      | "state"
      | "tel"
      | "url"
      | "legacyId"
    >
  : V extends "_minimal"
  ? Pick<Clients, "id" | "name">
  : never;
