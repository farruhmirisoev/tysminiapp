import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SVidAct extends BaseIntegerIdEntity {
  static NAME = "insurance_SVidAct";
  name?: string | null;
}
export type SVidActViewName = "_base" | "_local" | "_minimal";
export type SVidActView<V extends SVidActViewName> = V extends "_base"
  ? Pick<SVidAct, "id" | "name">
  : V extends "_local"
  ? Pick<SVidAct, "id" | "name">
  : V extends "_minimal"
  ? Pick<SVidAct, "id" | "name">
  : never;
