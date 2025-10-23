import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
export class InventoryReport extends BaseUuidEntity {
  static NAME = "inventory_InventoryReport";
  begin?: any | null;
  end?: any | null;
  type?: string | null;
  beginBalance?: string | null;
  income?: string | null;
  sold?: string | null;
  broken?: string | null;
  lost?: string | null;
  endBalance?: string | null;
}
export type InventoryReportViewName = "_base" | "_local" | "_minimal";
export type InventoryReportView<V extends InventoryReportViewName> =
  V extends "_base"
    ? Pick<InventoryReport, "id" | "type">
    : V extends "_minimal"
    ? Pick<InventoryReport, "id" | "type">
    : never;
