import { BaseStringIdEntity } from "./base/sys$BaseStringIdEntity";
export class SClasses extends BaseStringIdEntity {
  static NAME = "insurance_SClasses";
  id?: string;
  name?: string | null;
}
export type SClassesViewName = "_base" | "_local" | "_minimal";
export type SClassesView<V extends SClassesViewName> = V extends "_base"
  ? Pick<SClasses, "id" | "name">
  : V extends "_local"
  ? Pick<SClasses, "id" | "name">
  : V extends "_minimal"
  ? Pick<SClasses, "id" | "name">
  : never;
