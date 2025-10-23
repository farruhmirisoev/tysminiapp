import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
export class DogovorGraph extends BaseLongIdEntity {
  static NAME = "insurance_DogovorGraph";
  idDogovor?: any | null;
  oldDog?: boolean | null;
  rpm?: any | null;
  summa?: any | null;
  vDate?: any | null;
}
export type DogovorGraphViewName = "_base" | "_local" | "_minimal";
export type DogovorGraphView<V extends DogovorGraphViewName> = V extends "_base"
  ? Pick<
      DogovorGraph,
      "id" | "idDogovor" | "oldDog" | "rpm" | "summa" | "vDate"
    >
  : V extends "_local"
  ? Pick<
      DogovorGraph,
      "id" | "idDogovor" | "oldDog" | "rpm" | "summa" | "vDate"
    >
  : never;
