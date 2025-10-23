import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SPost extends BaseIntegerIdEntity {
  static NAME = "insurance_SPost";
  name?: string | null;
  legacyId?: any | null;
}
export type SPostViewName = "_base" | "_local" | "_minimal";
export type SPostView<V extends SPostViewName> = V extends "_base"
  ? Pick<SPost, "id" | "name" | "legacyId">
  : V extends "_local"
  ? Pick<SPost, "id" | "name" | "legacyId">
  : V extends "_minimal"
  ? Pick<SPost, "id" | "name">
  : never;
