import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { ContractExt } from "./base$ContractExt";
export class ContractExtPaymentGraph extends BaseUuidEntity {
  static NAME = "ContractExtPaymentGraph";
  contractExt?: ContractExt | null;
  date?: any | null;
  amount?: any | null;
}
export type ContractExtPaymentGraphViewName = "_base" | "_local" | "_minimal";
export type ContractExtPaymentGraphView<
  V extends ContractExtPaymentGraphViewName
> = V extends "_base"
  ? Pick<ContractExtPaymentGraph, "id" | "contractExt" | "date" | "amount">
  : V extends "_local"
  ? Pick<ContractExtPaymentGraph, "id" | "date" | "amount">
  : V extends "_minimal"
  ? Pick<ContractExtPaymentGraph, "id" | "contractExt">
  : never;
