import { BaseGenericIdEntity } from "./base/sys$BaseGenericIdEntity";
export class State extends BaseGenericIdEntity {
  static NAME = "insurance_State";
  id?: object;
  dealType?: number | null;
  edit?: boolean | null;
  name?: string | null;
}
export type StateViewName = "_base" | "_local" | "_minimal";
export type StateView<V extends StateViewName> = V extends "_base"
  ? Pick<State, "id" | "name" | "dealType" | "edit">
  : V extends "_local"
  ? Pick<State, "id" | "dealType" | "edit" | "name">
  : V extends "_minimal"
  ? Pick<State, "id" | "name">
  : never;
