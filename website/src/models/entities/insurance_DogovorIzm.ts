import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
import { Dogovor } from "./insurance_Dogovor";
export class DogovorIzm extends BaseLongIdEntity {
  static NAME = "insurance_DogovorIzm";
  idDogovor?: Dogovor | null;
  idSIzmTip?: number | null;
  num?: string | null;
  state?: number | null;
  vDate?: any | null;
}
export type DogovorIzmViewName = "_base" | "_local" | "_minimal";
export type DogovorIzmView<V extends DogovorIzmViewName> = V extends "_base"
  ? Pick<DogovorIzm, "id" | "idSIzmTip" | "num" | "state" | "vDate">
  : V extends "_local"
  ? Pick<DogovorIzm, "id" | "idSIzmTip" | "num" | "state" | "vDate">
  : never;
