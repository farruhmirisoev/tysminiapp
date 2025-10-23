import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
export class Members extends BaseLongIdEntity {
  static NAME = "insurance_Members";
  acc?: string | null;
  address?: string | null;
  agentCom?: any | null;
  branch?: number | null;
  coment?: string | null;
  doc?: string | null;
  email?: string | null;
  fax?: string | null;
  finUslug?: boolean | null;
  gosUch?: boolean | null;
  idSClientType?: number | null;
  idSCountry?: any | null;
  idSOpf?: number | null;
  idSPost?: number | null;
  idSResident?: number | null;
  idSStatus?: number | null;
  inn?: string | null;
  kodSoatoSRayobl?: string | null;
  kommer?: boolean | null;
  kontakt?: string | null;
  kontaktDol?: string | null;
  kontaktDovDate?: any | null;
  kontaktDovNum?: string | null;
  kontaktDovSrok?: any | null;
  kontaktLimit?: any | null;
  kontaktPassw?: string | null;
  licenceDate?: any | null;
  licenceNum?: string | null;
  malBiz?: boolean | null;
  mfo?: string | null;
  name?: string | null;
  okonh?: string | null;
  passportDateEnd?: any | null;
  passwordDataVid?: any | null;
  passwordNum?: string | null;
  passwordSer?: string | null;
  passwordVidan?: string | null;
  patentDate?: any | null;
  patentDateEnd?: any | null;
  patentNum?: string | null;
  patentNumReestr?: string | null;
  patentOrgan?: string | null;
  rukov?: string | null;
  soglAvto?: boolean | null;
  soglDate?: any | null;
  soglDateEnd?: any | null;
  soglNum?: string | null;
  state?: number | null;
  status?: number | null;
  tel?: string | null;
  url?: string | null;
  legacyId?: any | null;
}
export type MembersViewName = "_base" | "_local" | "_minimal";
export type MembersView<V extends MembersViewName> = V extends "_base"
  ? Pick<
      Members,
      | "id"
      | "name"
      | "acc"
      | "address"
      | "agentCom"
      | "branch"
      | "coment"
      | "doc"
      | "email"
      | "fax"
      | "finUslug"
      | "gosUch"
      | "idSClientType"
      | "idSCountry"
      | "idSOpf"
      | "idSPost"
      | "idSResident"
      | "idSStatus"
      | "inn"
      | "kodSoatoSRayobl"
      | "kommer"
      | "kontakt"
      | "kontaktDol"
      | "kontaktDovDate"
      | "kontaktDovNum"
      | "kontaktDovSrok"
      | "kontaktLimit"
      | "kontaktPassw"
      | "licenceDate"
      | "licenceNum"
      | "malBiz"
      | "mfo"
      | "okonh"
      | "passportDateEnd"
      | "passwordDataVid"
      | "passwordNum"
      | "passwordSer"
      | "passwordVidan"
      | "patentDate"
      | "patentDateEnd"
      | "patentNum"
      | "patentNumReestr"
      | "patentOrgan"
      | "rukov"
      | "soglAvto"
      | "soglDate"
      | "soglDateEnd"
      | "soglNum"
      | "state"
      | "status"
      | "tel"
      | "url"
      | "legacyId"
    >
  : V extends "_local"
  ? Pick<
      Members,
      | "id"
      | "acc"
      | "address"
      | "agentCom"
      | "branch"
      | "coment"
      | "doc"
      | "email"
      | "fax"
      | "finUslug"
      | "gosUch"
      | "idSClientType"
      | "idSCountry"
      | "idSOpf"
      | "idSPost"
      | "idSResident"
      | "idSStatus"
      | "inn"
      | "kodSoatoSRayobl"
      | "kommer"
      | "kontakt"
      | "kontaktDol"
      | "kontaktDovDate"
      | "kontaktDovNum"
      | "kontaktDovSrok"
      | "kontaktLimit"
      | "kontaktPassw"
      | "licenceDate"
      | "licenceNum"
      | "malBiz"
      | "mfo"
      | "name"
      | "okonh"
      | "passportDateEnd"
      | "passwordDataVid"
      | "passwordNum"
      | "passwordSer"
      | "passwordVidan"
      | "patentDate"
      | "patentDateEnd"
      | "patentNum"
      | "patentNumReestr"
      | "patentOrgan"
      | "rukov"
      | "soglAvto"
      | "soglDate"
      | "soglDateEnd"
      | "soglNum"
      | "state"
      | "status"
      | "tel"
      | "url"
      | "legacyId"
    >
  : V extends "_minimal"
  ? Pick<Members, "id" | "name">
  : never;
