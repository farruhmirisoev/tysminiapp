import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SVidOplata extends BaseIntegerIdEntity {
  static NAME = "insurance_SVidOplata";
  name?: string | null;
  tip?: number | null;
}
export type SVidOplataViewName = "_base" | "_local" | "_minimal";
export type SVidOplataView<V extends SVidOplataViewName> = V extends "_base"
  ? Pick<SVidOplata, "id" | "name" | "tip">
  : V extends "_local"
  ? Pick<SVidOplata, "id" | "name" | "tip">
  : V extends "_minimal"
  ? Pick<SVidOplata, "id" | "name">
  : never;
