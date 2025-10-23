import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SVidRashod extends BaseIntegerIdEntity {
  static NAME = "insurance_SVidRashod";
  name?: string | null;
  tip?: number | null;
}
export type SVidRashodViewName = "_base" | "_local" | "_minimal";
export type SVidRashodView<V extends SVidRashodViewName> = V extends "_base"
  ? Pick<SVidRashod, "id" | "name" | "tip">
  : V extends "_local"
  ? Pick<SVidRashod, "id" | "name" | "tip">
  : V extends "_minimal"
  ? Pick<SVidRashod, "id" | "name">
  : never;
