import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
import { PaymentExcelState } from "../enums/enums";
export class ClaimExcel extends BaseLongIdEntity {
  static NAME = "ClaimExcel";
  number?: number | null;
  claimDate?: string | null;
  insurant?: string | null;
  object?: string | null;
  eventDate?: string | null;
  contractNumber?: string | null;
  policyNember?: string | null;
  policySum?: string | null;
  policySumAfterPay?: string | null;
  declaredLosses?: string | null;
  claimSettlementDate?: string | null;
  payedSum?: string | null;
  refusalDate?: string | null;
  refusalSum?: string | null;
  unsettledLossesSum?: string | null;
  insClass?: string | null;
  code?: string | null;
  region?: string | null;
  regCode?: string | null;
  euro?: string | null;
  beneficiary?: string | null;
  benType?: string | null;
  protocol?: string | null;
  regress?: string | null;
  recipient?: string | null;
  culprit?: string | null;
  executor?: string | null;
  euroCompany?: string | null;
  state?: PaymentExcelState | null;
  error?: string | null;
}
export type ClaimExcelViewName = "_base" | "_local" | "_minimal";
export type ClaimExcelView<V extends ClaimExcelViewName> = V extends "_base"
  ? Pick<
      ClaimExcel,
      | "id"
      | "number"
      | "claimDate"
      | "insurant"
      | "object"
      | "eventDate"
      | "contractNumber"
      | "policyNember"
      | "policySum"
      | "policySumAfterPay"
      | "declaredLosses"
      | "claimSettlementDate"
      | "payedSum"
      | "refusalDate"
      | "refusalSum"
      | "unsettledLossesSum"
      | "insClass"
      | "code"
      | "region"
      | "regCode"
      | "euro"
      | "beneficiary"
      | "benType"
      | "protocol"
      | "regress"
      | "recipient"
      | "culprit"
      | "executor"
      | "euroCompany"
      | "state"
      | "error"
    >
  : V extends "_local"
  ? Pick<
      ClaimExcel,
      | "id"
      | "number"
      | "claimDate"
      | "insurant"
      | "object"
      | "eventDate"
      | "contractNumber"
      | "policyNember"
      | "policySum"
      | "policySumAfterPay"
      | "declaredLosses"
      | "claimSettlementDate"
      | "payedSum"
      | "refusalDate"
      | "refusalSum"
      | "unsettledLossesSum"
      | "insClass"
      | "code"
      | "region"
      | "regCode"
      | "euro"
      | "beneficiary"
      | "benType"
      | "protocol"
      | "regress"
      | "recipient"
      | "culprit"
      | "executor"
      | "euroCompany"
      | "state"
      | "error"
    >
  : never;
