import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
export class VPayment extends BaseUuidEntity {
  static NAME = "insurance_VPayment";
  organizationName?: string | null;
  organizationAccount?: string | null;
  organizationBank?: string | null;
  documentNumber?: string | null;
  documentDate?: any | null;
  currency?: string | null;
  inn?: string | null;
  party?: string | null;
  partyAccount?: string | null;
  purpose?: string | null;
  amount?: any | null;
  balance?: any | null;
}
export type VPaymentViewName = "_base" | "_local" | "_minimal";
export type VPaymentView<V extends VPaymentViewName> = V extends "_base"
  ? Pick<
      VPayment,
      | "id"
      | "documentNumber"
      | "documentDate"
      | "organizationName"
      | "organizationAccount"
      | "organizationBank"
      | "currency"
      | "inn"
      | "party"
      | "partyAccount"
      | "purpose"
      | "amount"
      | "balance"
    >
  : V extends "_local"
  ? Pick<
      VPayment,
      | "id"
      | "organizationName"
      | "organizationAccount"
      | "organizationBank"
      | "documentNumber"
      | "documentDate"
      | "currency"
      | "inn"
      | "party"
      | "partyAccount"
      | "purpose"
      | "amount"
      | "balance"
    >
  : V extends "_minimal"
  ? Pick<VPayment, "id" | "documentNumber" | "documentDate">
  : never;
