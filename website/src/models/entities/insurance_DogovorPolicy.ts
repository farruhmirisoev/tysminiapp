import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { Dogovor } from "./insurance_Dogovor";
import { Policy } from "./insurance_Policy";
export class DogovorPolicy extends BaseUuidEntity {
  static NAME = "insurance_DogovorPolicy";
  idDogovor?: Dogovor | null;
  idPolicy?: Policy | null;
  vDate?: any | null;
}
export type DogovorPolicyViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "dogovorPolicy-view";
export type DogovorPolicyView<V extends DogovorPolicyViewName> =
  V extends "_base"
    ? Pick<DogovorPolicy, "id" | "vDate">
    : V extends "_local"
    ? Pick<DogovorPolicy, "id" | "vDate">
    : V extends "dogovorPolicy-view"
    ? Pick<DogovorPolicy, "id" | "vDate" | "idDogovor" | "idPolicy">
    : never;
