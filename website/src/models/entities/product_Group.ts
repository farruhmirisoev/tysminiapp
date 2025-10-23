import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class Group extends BaseIntegerIdEntity {
  static NAME = "product_Group";
  name?: string | null;
  nameUz?: string | null;
  order?: number | null;
}
export type GroupViewName = "_base" | "_local" | "_minimal";
export type GroupView<V extends GroupViewName> = V extends "_base"
  ? Pick<Group, "id" | "name" | "nameUz" | "order">
  : V extends "_local"
  ? Pick<Group, "id" | "name" | "nameUz" | "order">
  : V extends "_minimal"
  ? Pick<Group, "id" | "name">
  : never;
