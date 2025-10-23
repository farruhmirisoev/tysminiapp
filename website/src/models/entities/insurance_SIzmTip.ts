import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SIzmTip extends BaseIntegerIdEntity {
  static NAME = "insurance_SIzmTip";
  name?: string | null;
}
export type SIzmTipViewName = "_base" | "_local" | "_minimal";
export type SIzmTipView<V extends SIzmTipViewName> = V extends "_base"
  ? Pick<SIzmTip, "id" | "name">
  : V extends "_local"
  ? Pick<SIzmTip, "id" | "name">
  : V extends "_minimal"
  ? Pick<SIzmTip, "id" | "name">
  : never;
