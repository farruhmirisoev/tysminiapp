import { AbstractContract } from "./AbstractContract";
import { Attachment } from "./base$Attachment";
export class Contract extends AbstractContract {
  static NAME = "base$Contract";
  attachments?: Attachment[] | null;
}
export type ContractViewName = "_base" | "_local" | "_minimal";
export type ContractView<V extends ContractViewName> = V extends "_base"
  ? Pick<
      Contract,
      | "id"
      | "contractNumber"
      | "legacyId"
      | "fundId"
      | "startDate"
      | "endDate"
      | "writeHistory"
      | "partyType"
      | "contractDate"
      | "contractStartDate"
      | "contractEndDate"
      | "description"
      | "fixDate"
    >
  : V extends "_local"
  ? Pick<
      Contract,
      | "id"
      | "legacyId"
      | "fundId"
      | "startDate"
      | "endDate"
      | "writeHistory"
      | "partyType"
      | "contractNumber"
      | "contractDate"
      | "contractStartDate"
      | "contractEndDate"
      | "description"
      | "fixDate"
    >
  : V extends "_minimal"
  ? Pick<Contract, "id" | "contractNumber">
  : never;
