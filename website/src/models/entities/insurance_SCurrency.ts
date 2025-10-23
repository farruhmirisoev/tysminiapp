import { BaseStringIdEntity } from "./base/sys$BaseStringIdEntity";
export class SCurrency extends BaseStringIdEntity {
  static NAME = "insurance_SCurrency";
  id?: string;
  dateV?: any | null;
  kurs?: any | null;
  name?: string | null;
}
export type SCurrencyViewName = "_base" | "_local" | "_minimal";
export type SCurrencyView<V extends SCurrencyViewName> = V extends "_base"
  ? Pick<SCurrency, "id" | "name" | "dateV" | "kurs">
  : V extends "_local"
  ? Pick<SCurrency, "id" | "dateV" | "kurs" | "name">
  : V extends "_minimal"
  ? Pick<SCurrency, "id" | "name">
  : never;
