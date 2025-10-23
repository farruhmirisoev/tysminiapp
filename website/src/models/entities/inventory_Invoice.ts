import { StandardEntity } from "./base/sys$StandardEntity";
import { Operation, InvoiceStatus } from "../enums/enums";
import { InventoryType } from "./inventory_Type";
import { UserExtend } from "./extend_User";
export class Invoice extends StandardEntity {
  static NAME = "inventory_Invoice";
  number?: string | null;
  date?: any | null;
  operation?: Operation | null;
  inventoryType?: InventoryType | null;
  fromNumber?: number | null;
  toNumber?: number | null;
  fromUser?: UserExtend | null;
  toUser?: UserExtend | null;
  status?: InvoiceStatus | null;
  legacyUserId?: any | null;
}
export type InvoiceViewName = "_base" | "_local" | "_minimal";
export type InvoiceView<V extends InvoiceViewName> = V extends "_base"
  ? Pick<
      Invoice,
      | "id"
      | "number"
      | "date"
      | "operation"
      | "fromNumber"
      | "toNumber"
      | "status"
      | "legacyUserId"
    >
  : V extends "_local"
  ? Pick<
      Invoice,
      | "id"
      | "number"
      | "date"
      | "operation"
      | "fromNumber"
      | "toNumber"
      | "status"
      | "legacyUserId"
    >
  : V extends "_minimal"
  ? Pick<Invoice, "id" | "number">
  : never;
