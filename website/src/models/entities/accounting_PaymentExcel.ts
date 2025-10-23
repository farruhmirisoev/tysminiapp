import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
import { PaymentExcelState } from "../enums/enums";
export class PaymentExcel extends BaseLongIdEntity {
  static NAME = "accounting_PaymentExcel";
  number?: number | null;
  docNumber?: string | null;
  docDate?: string | null;
  clientBankCode?: string | null;
  clientAccount?: string | null;
  clientName?: string | null;
  clientTin?: string | null;
  orgBankCode?: string | null;
  orgAccount?: string | null;
  orgTin?: string | null;
  income?: string | null;
  outcome?: string | null;
  details?: string | null;
  state?: PaymentExcelState | null;
  error?: string | null;
}
export type PaymentExcelViewName = "_base" | "_local" | "_minimal";
export type PaymentExcelView<V extends PaymentExcelViewName> = V extends "_base"
  ? Pick<
      PaymentExcel,
      | "id"
      | "docNumber"
      | "number"
      | "docDate"
      | "clientBankCode"
      | "clientAccount"
      | "clientName"
      | "clientTin"
      | "orgBankCode"
      | "orgAccount"
      | "orgTin"
      | "income"
      | "outcome"
      | "details"
      | "state"
      | "error"
    >
  : V extends "_local"
  ? Pick<
      PaymentExcel,
      | "id"
      | "number"
      | "docNumber"
      | "docDate"
      | "clientBankCode"
      | "clientAccount"
      | "clientName"
      | "clientTin"
      | "orgBankCode"
      | "orgAccount"
      | "orgTin"
      | "income"
      | "outcome"
      | "details"
      | "state"
      | "error"
    >
  : V extends "_minimal"
  ? Pick<PaymentExcel, "id" | "docNumber">
  : never;
