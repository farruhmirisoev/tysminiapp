import { BaseContract } from "./BaseContract";
import { SubjectType, OsgoPeriodType } from "../enums/enums";
import { Beneficiary } from "./reference_OsgoBeneficiary1";
import { Period } from "./reference_OsgoPeriod1";
import { Vehicle } from "./osgo_VehicleOld";
import { Driver } from "./osgoDriverOld";
import { DrivedArea } from "./reference_OsgoDrivedArea1";
export class Osgo extends BaseContract {
  static NAME = "osgo_Osgo";
  ownerType?: SubjectType | null;
  ownerName?: string | null;
  applicantIsOwner?: boolean | null;
  applicantIsDriver?: boolean | null;
  ownerIsDriver?: boolean | null;
  discountType?: Beneficiary | null;
  periodType?: OsgoPeriodType | null;
  period?: Period | null;
  vehicle?: Vehicle | null;
  driversLimited?: boolean | null;
  driversCount?: number | null;
  drivers?: Driver[] | null;
  drivedArea?: DrivedArea | null;
  insRuleViolated?: boolean | null;
  totalAmount?: any | null;
  discountAmount?: any | null;
  tariffBase?: any | null;
  territoryCoeff?: any | null;
  limitedDriversCoeff?: any | null;
  seasonCoeff?: any | null;
  incidentCoeff?: any | null;
  ruleViolationCoeff?: any | null;
  ageCoeff?: any | null;
  experienceCoeff?: any | null;
  periodCoeff?: any | null;
  totalCoeff?: any | null;
  discountCoeff?: any | null;
  fundId?: any | null;
  eOsgo?: boolean | null;
  eOsgoPolicySeria?: string | null;
  eOsgoPolicyNumber?: any | null;
}
export type OsgoViewName = "_base" | "_local" | "_minimal";
export type OsgoView<V extends OsgoViewName> = V extends "_base"
  ? Pick<
      Osgo,
      | "id"
      | "contractDate"
      | "ownerType"
      | "ownerName"
      | "applicantIsOwner"
      | "applicantIsDriver"
      | "ownerIsDriver"
      | "periodType"
      | "driversLimited"
      | "driversCount"
      | "insRuleViolated"
      | "totalAmount"
      | "discountAmount"
      | "tariffBase"
      | "territoryCoeff"
      | "limitedDriversCoeff"
      | "seasonCoeff"
      | "incidentCoeff"
      | "ruleViolationCoeff"
      | "ageCoeff"
      | "experienceCoeff"
      | "periodCoeff"
      | "totalCoeff"
      | "discountCoeff"
      | "fundId"
      | "eOsgo"
      | "eOsgoPolicySeria"
      | "eOsgoPolicyNumber"
      | "productGroup"
      | "productSubGroup"
      | "product"
      | "insurantType"
      | "beneficiaryType"
      | "applicationNumber"
      | "applicationDate"
      | "contractNumber"
      | "contractFromDate"
      | "contractToDate"
      | "limitOfLiability"
      | "limitOfLiabilityCondition"
      | "damageCompensationTerm"
      | "franchiseUse"
      | "franchiseBase"
      | "franchiseType"
      | "franchiseUnit"
      | "franchise"
      | "premium"
      | "commission"
      | "paymentGraphType"
      | "distributionMethod"
      | "policyDate"
      | "description"
      | "duplicateCommission"
      | "terminateDate"
      | "terminatePremium"
      | "terminateCase"
      | "reissuanceDate"
      | "reissuanceType"
      | "reissuanceDifference"
      | "reissuanceSurcharge"
      | "fixDate"
      | "status"
      | "userpId"
    >
  : V extends "_local"
  ? Pick<
      Osgo,
      | "id"
      | "ownerType"
      | "ownerName"
      | "applicantIsOwner"
      | "applicantIsDriver"
      | "ownerIsDriver"
      | "periodType"
      | "driversLimited"
      | "driversCount"
      | "insRuleViolated"
      | "totalAmount"
      | "discountAmount"
      | "tariffBase"
      | "territoryCoeff"
      | "limitedDriversCoeff"
      | "seasonCoeff"
      | "incidentCoeff"
      | "ruleViolationCoeff"
      | "ageCoeff"
      | "experienceCoeff"
      | "periodCoeff"
      | "totalCoeff"
      | "discountCoeff"
      | "fundId"
      | "eOsgo"
      | "eOsgoPolicySeria"
      | "eOsgoPolicyNumber"
      | "productGroup"
      | "productSubGroup"
      | "product"
      | "insurantType"
      | "beneficiaryType"
      | "applicationNumber"
      | "applicationDate"
      | "contractNumber"
      | "contractDate"
      | "contractFromDate"
      | "contractToDate"
      | "limitOfLiability"
      | "limitOfLiabilityCondition"
      | "damageCompensationTerm"
      | "franchiseUse"
      | "franchiseBase"
      | "franchiseType"
      | "franchiseUnit"
      | "franchise"
      | "premium"
      | "commission"
      | "paymentGraphType"
      | "distributionMethod"
      | "policyDate"
      | "description"
      | "duplicateCommission"
      | "terminateDate"
      | "terminatePremium"
      | "terminateCase"
      | "reissuanceDate"
      | "reissuanceType"
      | "reissuanceDifference"
      | "reissuanceSurcharge"
      | "fixDate"
      | "status"
      | "userpId"
    >
  : V extends "_minimal"
  ? Pick<Osgo, "id" | "contractDate">
  : never;
