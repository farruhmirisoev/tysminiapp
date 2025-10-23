import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SStatus extends BaseIntegerIdEntity {
  static NAME = "insurance_SStatus";
  name?: string | null;
}
export type SStatusViewName = "_base" | "_local" | "_minimal";
export type SStatusView<V extends SStatusViewName> = V extends "_base"
  ? Pick<SStatus, "id" | "name">
  : V extends "_local"
  ? Pick<SStatus, "id" | "name">
  : V extends "_minimal"
  ? Pick<SStatus, "id" | "name">
  : never;
