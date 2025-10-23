import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { Dogovor } from "./insurance_Dogovor";
export class DogovorDop extends BaseUuidEntity {
  static NAME = "insurance_DogovorDop";
  idDogovor?: Dogovor | null;
  idSDogDopFields?: any | null;
  value?: string | null;
}
export type DogovorDopViewName = "_base" | "_local" | "_minimal";
export type DogovorDopView<V extends DogovorDopViewName> = V extends "_base"
  ? Pick<DogovorDop, "id" | "idSDogDopFields" | "value">
  : V extends "_local"
  ? Pick<DogovorDop, "id" | "idSDogDopFields" | "value">
  : never;
