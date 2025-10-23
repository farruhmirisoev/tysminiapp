import { StandardEntity } from "./base/sys$StandardEntity";
import { InventoryType } from "./inventory_Type";
import { Invoice } from "./inventory_Invoice";
import { User } from "./base/sec$User";
import { Status } from "../enums/enums";
import { History } from "./inventory_History";
import { ContractExt } from "./base$ContractExt";
import { Policy } from "./base$Policy";
export class Inventory extends StandardEntity {
  static NAME = "inventory_Inventory";
  inventoryType?: InventoryType | null;
  number?: number | null;
  givenDate?: any | null;
  invoice?: Invoice | null;
  user?: User | null;
  policyGivenDate?: any | null;
  begin?: any | null;
  end?: any | null;
  insuredSum?: any | null;
  premium?: any | null;
  status?: Status | null;
  history?: History[] | null;
  contractExt?: ContractExt | null;
  userpId?: any | null;
  policy?: Policy | null;
}
export type InventoryViewName = "_base" | "_local" | "_minimal";
export type InventoryView<V extends InventoryViewName> = V extends "_base"
  ? Pick<
      Inventory,
      | "id"
      | "number"
      | "givenDate"
      | "policyGivenDate"
      | "begin"
      | "end"
      | "insuredSum"
      | "premium"
      | "status"
      | "userpId"
    >
  : V extends "_local"
  ? Pick<
      Inventory,
      | "id"
      | "number"
      | "givenDate"
      | "policyGivenDate"
      | "begin"
      | "end"
      | "insuredSum"
      | "premium"
      | "status"
      | "userpId"
    >
  : V extends "_minimal"
  ? Pick<Inventory, "id" | "number">
  : never;
