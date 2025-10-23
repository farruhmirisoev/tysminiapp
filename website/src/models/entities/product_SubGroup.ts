import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { Group } from "./product_Group";
export class SubGroup extends BaseIntegerIdEntity {
  static NAME = "product_SubGroup";
  group?: Group | null;
  name?: string | null;
  nameUz?: string | null;
  order?: number | null;
}
export type SubGroupViewName = "_base" | "_local" | "_minimal";
export type SubGroupView<V extends SubGroupViewName> = V extends "_base"
  ? Pick<SubGroup, "id" | "name" | "nameUz" | "order">
  : V extends "_local"
  ? Pick<SubGroup, "id" | "name" | "nameUz" | "order">
  : V extends "_minimal"
  ? Pick<SubGroup, "id" | "name">
  : never;
