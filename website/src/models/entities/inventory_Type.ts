import { BaseStringIdEntity } from "./base/sys$BaseStringIdEntity";
import { Product } from "./product_Product";
import { UserExtend } from "./extend_User";
export class InventoryType extends BaseStringIdEntity {
  static NAME = "inventory_Type";
  id?: string;
  epolicy?: boolean | null;
  series?: string | null;
  name?: string | null;
  numberOfDigits?: number | null;
  description?: string | null;
  active?: boolean | null;
  userpId?: any | null;
  products?: Product[] | null;
  users?: UserExtend[] | null;
}
export type InventoryTypeViewName = "_base" | "_local" | "_minimal";
export type InventoryTypeView<V extends InventoryTypeViewName> =
  V extends "_base"
    ? Pick<
        InventoryType,
        | "id"
        | "name"
        | "epolicy"
        | "series"
        | "numberOfDigits"
        | "description"
        | "active"
        | "userpId"
      >
    : V extends "_local"
    ? Pick<
        InventoryType,
        | "id"
        | "epolicy"
        | "series"
        | "name"
        | "numberOfDigits"
        | "description"
        | "active"
        | "userpId"
      >
    : V extends "_minimal"
    ? Pick<InventoryType, "id" | "name">
    : never;
