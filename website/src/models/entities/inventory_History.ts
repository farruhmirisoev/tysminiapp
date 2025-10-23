import { StandardEntity } from "./base/sys$StandardEntity";
import { Inventory } from "./inventory_Inventory";
import { User } from "./base/sec$User";
import { Status } from "../enums/enums";
export class History extends StandardEntity {
  static NAME = "inventory_History";
  date?: any | null;
  invoice?: string | null;
  inventory?: Inventory | null;
  fromUser?: User | null;
  toUser?: User | null;
  status?: Status | null;
}
export type HistoryViewName = "_base" | "_local" | "_minimal";
export type HistoryView<V extends HistoryViewName> = V extends "_base"
  ? Pick<History, "id" | "inventory" | "date" | "invoice" | "status">
  : V extends "_local"
  ? Pick<History, "id" | "date" | "invoice" | "status">
  : V extends "_minimal"
  ? Pick<History, "id" | "inventory">
  : never;
