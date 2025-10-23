import { StandardEntity } from "./base/sys$StandardEntity";
import { Inventory } from "./inventory_Inventory";
import { InventoryType } from "./inventory_Type";
import { PolicyStatus } from "../enums/enums";
import { ContractExt } from "./base$ContractExt";
import { Auto } from "./customs$Auto";
import { Payment } from "./customs$Payment";
export class Policy extends StandardEntity {
  static NAME = "base$Policy";
  inventory?: Inventory | null;
  inventoryType?: InventoryType | null;
  number?: any | null;
  policyGivenDate?: any | null;
  begin?: any | null;
  end?: any | null;
  insuredSum?: any | null;
  premium?: any | null;
  status?: PolicyStatus | null;
  contractExt?: ContractExt | null;
  userpId?: any | null;
  customsAutos?: Auto[] | null;
  customsPayments?: Payment[] | null;
}
export type PolicyViewName = "_base" | "_local" | "_minimal" | "policy-view";
export type PolicyView<V extends PolicyViewName> = V extends "_base"
  ? Pick<
      Policy,
      | "id"
      | "inventory"
      | "number"
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
      Policy,
      | "id"
      | "number"
      | "policyGivenDate"
      | "begin"
      | "end"
      | "insuredSum"
      | "premium"
      | "status"
      | "userpId"
    >
  : V extends "_minimal"
  ? Pick<Policy, "id" | "inventory">
  : V extends "policy-view"
  ? Pick<
      Policy,
      | "id"
      | "number"
      | "policyGivenDate"
      | "begin"
      | "end"
      | "insuredSum"
      | "premium"
      | "status"
      | "userpId"
      | "contractExt"
    >
  : never;
