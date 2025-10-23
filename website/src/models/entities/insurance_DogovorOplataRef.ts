import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { DogovorOplata } from "./insurance_DogovorOplata";
export class DogovorOplataRef extends BaseUuidEntity {
  static NAME = "insurance_DogovorOplataRef";
  comments?: string | null;
  idDogovor?: any | null;
  idDogovorOplata?: DogovorOplata | null;
  oldDog?: boolean | null;
  summa?: any | null;
  tip?: boolean | null;
}
export type DogovorOplataRefViewName = "_base" | "_local" | "_minimal";
export type DogovorOplataRefView<V extends DogovorOplataRefViewName> =
  V extends "_base"
    ? Pick<
        DogovorOplataRef,
        "id" | "comments" | "idDogovor" | "oldDog" | "summa" | "tip"
      >
    : V extends "_local"
    ? Pick<
        DogovorOplataRef,
        "id" | "comments" | "idDogovor" | "oldDog" | "summa" | "tip"
      >
    : never;
