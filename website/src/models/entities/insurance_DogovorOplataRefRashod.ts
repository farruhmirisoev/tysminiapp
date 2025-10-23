import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { DogovorOplata } from "./insurance_DogovorOplata";
export class DogovorOplataRefRashod extends BaseUuidEntity {
  static NAME = "insurance_DogovorOplataRefRashod";
  comments?: string | null;
  idDogovor?: any | null;
  idDogovorOplata?: DogovorOplata | null;
  summa?: any | null;
  tip?: boolean | null;
}
export type DogovorOplataRefRashodViewName = "_base" | "_local" | "_minimal";
export type DogovorOplataRefRashodView<
  V extends DogovorOplataRefRashodViewName
> = V extends "_base"
  ? Pick<
      DogovorOplataRefRashod,
      "id" | "comments" | "idDogovor" | "summa" | "tip"
    >
  : V extends "_local"
  ? Pick<
      DogovorOplataRefRashod,
      "id" | "comments" | "idDogovor" | "summa" | "tip"
    >
  : never;
