import { StandardEntity } from "./base/sys$StandardEntity";
import { Claim } from "./baseClaim";
import { ObjectType } from "../enums/enums";
import { Individual } from "./base/base$Individual";
import { Party } from "./base/base$Party";
import { Vehicle } from "./osgo_Vehicle";
import { InsurancePayment } from "./claim$InsurancePayment";
export class ClaimDamage extends StandardEntity {
  static NAME = "insurance_ClaimDamage";
  claim?: Claim | null;
  damageType?: ObjectType | null;
  person?: Individual | null;
  ownerType?: any | null;
  owner?: Party | null;
  vehicle?: Vehicle | null;
  deathCertificate?: string | null;
  claimedDamage?: any | null;
  medicalConclusionDocumentDate?: any | null;
  medicalConclusionInstitution?: string | null;
  medicalConclusionDocumentName?: string | null;
  medicalConclusionDocumentNumber?: string | null;
  appraiserInn?: string | null;
  appraiserReportNumber?: string | null;
  appraiserReportDate?: any | null;
  property?: string | null;
  fundId?: any | null;
  payments?: InsurancePayment[] | null;
}
export type ClaimDamageViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "claimDamage-view";
export type ClaimDamageView<V extends ClaimDamageViewName> = V extends "_base"
  ? Pick<
      ClaimDamage,
      | "id"
      | "damageType"
      | "ownerType"
      | "deathCertificate"
      | "claimedDamage"
      | "medicalConclusionDocumentDate"
      | "medicalConclusionInstitution"
      | "medicalConclusionDocumentName"
      | "medicalConclusionDocumentNumber"
      | "appraiserInn"
      | "appraiserReportNumber"
      | "appraiserReportDate"
      | "property"
      | "fundId"
    >
  : V extends "_local"
  ? Pick<
      ClaimDamage,
      | "id"
      | "damageType"
      | "ownerType"
      | "deathCertificate"
      | "claimedDamage"
      | "medicalConclusionDocumentDate"
      | "medicalConclusionInstitution"
      | "medicalConclusionDocumentName"
      | "medicalConclusionDocumentNumber"
      | "appraiserInn"
      | "appraiserReportNumber"
      | "appraiserReportDate"
      | "property"
      | "fundId"
    >
  : V extends "claimDamage-view"
  ? Pick<
      ClaimDamage,
      | "id"
      | "damageType"
      | "ownerType"
      | "deathCertificate"
      | "claimedDamage"
      | "medicalConclusionDocumentDate"
      | "medicalConclusionInstitution"
      | "medicalConclusionDocumentName"
      | "medicalConclusionDocumentNumber"
      | "appraiserInn"
      | "appraiserReportNumber"
      | "appraiserReportDate"
      | "property"
      | "fundId"
      | "vehicle"
      | "person"
      | "owner"
    >
  : never;
