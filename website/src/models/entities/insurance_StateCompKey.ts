import { EmbeddableEntity } from "./base/sys$EmbeddableEntity";
export class StateCompKey extends EmbeddableEntity {
  static NAME = "insurance_StateCompKey";
  deal?: number | null;
  group?: number | null;
  id_?: number | null;
}
export type StateCompKeyViewName = "_base" | "_local" | "_minimal";
export type StateCompKeyView<V extends StateCompKeyViewName> = V extends "_base"
  ? Pick<StateCompKey, "deal" | "group" | "id_">
  : V extends "_local"
  ? Pick<StateCompKey, "deal" | "group" | "id_">
  : never;
