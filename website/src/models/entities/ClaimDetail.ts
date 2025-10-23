import { StandardEntity } from "./base/sys$StandardEntity";
export class ClaimDetail extends StandardEntity {
  static NAME = "ClaimDetail";
}
export type ClaimDetailViewName = "_base" | "_local" | "_minimal";
export type ClaimDetailView<V extends ClaimDetailViewName> = never;
