import { StandardEntity } from "./base/sys$StandardEntity";
import { Claim } from "./baseClaim";
import { ObjectType } from "../enums/enums";
import { ClaimDamage } from "./insurance_ClaimDamage";
export class InsurancePayment extends StandardEntity {
  static NAME = "claim$InsurancePayment";
  claim?: Claim | null;
  documentNumber?: string | null;
  name?: string | null;
  objectType?: ObjectType | null;
  object?: string | null;
  damageCost?: any | null;
  attachedDocument?: string | null;
  paymentAmount?: any | null;
  paymentDate?: any | null;
  tin?: string | null;
  accountNumber?: string | null;
  cardNumber?: string | null;
  fundId?: any | null;
  damage?: ClaimDamage | null;
}
export type InsurancePaymentViewName = "_base" | "_local" | "_minimal";
export type InsurancePaymentView<V extends InsurancePaymentViewName> =
  V extends "_base"
    ? Pick<
        InsurancePayment,
        | "id"
        | "name"
        | "documentNumber"
        | "objectType"
        | "object"
        | "damageCost"
        | "attachedDocument"
        | "paymentAmount"
        | "paymentDate"
        | "tin"
        | "accountNumber"
        | "cardNumber"
        | "fundId"
      >
    : V extends "_local"
    ? Pick<
        InsurancePayment,
        | "id"
        | "documentNumber"
        | "name"
        | "objectType"
        | "object"
        | "damageCost"
        | "attachedDocument"
        | "paymentAmount"
        | "paymentDate"
        | "tin"
        | "accountNumber"
        | "cardNumber"
        | "fundId"
      >
    : V extends "_minimal"
    ? Pick<InsurancePayment, "id" | "name">
    : never;
