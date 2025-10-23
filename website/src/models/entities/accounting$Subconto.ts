import { StandardEntity } from "./base/sys$StandardEntity";
export class Subconto extends StandardEntity {
  static NAME = "accounting$Subconto";
  code?: string | null;
  name?: string | null;
  className?: string | null;
}
export type SubcontoViewName = "_base" | "_local" | "_minimal";
export type SubcontoView<V extends SubcontoViewName> = V extends "_base"
  ? Pick<Subconto, "id" | "name" | "code" | "className">
  : V extends "_local"
  ? Pick<Subconto, "id" | "code" | "name" | "className">
  : V extends "_minimal"
  ? Pick<Subconto, "id" | "name">
  : never;
