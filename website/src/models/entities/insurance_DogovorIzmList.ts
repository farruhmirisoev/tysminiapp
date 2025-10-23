import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { DogovorIzm } from "./insurance_DogovorIzm";
export class DogovorIzmList extends BaseUuidEntity {
  static NAME = "insurance_DogovorIzmList";
  fieldName?: string | null;
  idDogovorIzm?: DogovorIzm | null;
  valueNew?: string | null;
  valueOld?: string | null;
}
export type DogovorIzmListViewName = "_base" | "_local" | "_minimal";
export type DogovorIzmListView<V extends DogovorIzmListViewName> =
  V extends "_base"
    ? Pick<DogovorIzmList, "id" | "fieldName" | "valueNew" | "valueOld">
    : V extends "_local"
    ? Pick<DogovorIzmList, "id" | "fieldName" | "valueNew" | "valueOld">
    : never;
