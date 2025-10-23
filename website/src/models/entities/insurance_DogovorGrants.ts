import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { Dogovor } from "./insurance_Dogovor";
import { SGrantType } from "./insurance_SGrantType";
export class DogovorGrants extends BaseUuidEntity {
  static NAME = "insurance_DogovorGrants";
  idDogovor?: Dogovor | null;
  idSGrantType?: SGrantType | null;
  idUsers?: number | null;
  vDate?: any | null;
}
export type DogovorGrantsViewName = "_base" | "_local" | "_minimal";
export type DogovorGrantsView<V extends DogovorGrantsViewName> =
  V extends "_base"
    ? Pick<DogovorGrants, "id" | "idUsers" | "vDate">
    : V extends "_local"
    ? Pick<DogovorGrants, "id" | "idUsers" | "vDate">
    : never;
