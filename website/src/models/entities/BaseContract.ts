import { StandardEntity } from "./base/sys$StandardEntity";
import {
  SubjectType,
  LimitOfLiability,
  DamageCompensationTerm,
  FranchiseBase,
  FranchiseType,
  FranchiseUnit,
  PaymentGraph,
  DistributionMethod,
  TerminateCase,
  ReissuanceType,
  BaseContractStatus,
} from "../enums/enums";
import { Contractor } from "./contractor_Contractor";
import { Organization } from "./company_Organization";
import { BaseContractAcl } from "./BaseContractAcl";
export class BaseContract extends StandardEntity {
  static NAME = "BaseContract";
  productGroup?: number | null;
  productSubGroup?: number | null;
  product?: any | null;
  insurantType?: SubjectType | null;
  insurant?: Contractor | null;
  beneficiaryType?: SubjectType | null;
  beneficiary?: Contractor | null;
  applicationNumber?: string | null;
  applicationDate?: any | null;
  contractNumber?: string | null;
  contractDate?: any | null;
  contractFromDate?: any | null;
  contractToDate?: any | null;
  limitOfLiability?: any | null;
  limitOfLiabilityCondition?: LimitOfLiability | null;
  damageCompensationTerm?: DamageCompensationTerm | null;
  franchiseUse?: boolean | null;
  franchiseBase?: FranchiseBase | null;
  franchiseType?: FranchiseType | null;
  franchiseUnit?: FranchiseUnit | null;
  franchise?: any | null;
  premium?: any | null;
  commission?: any | null;
  paymentGraphType?: PaymentGraph | null;
  distributionMethod?: DistributionMethod | null;
  policyDate?: any | null;
  organization?: Organization | null;
  description?: string | null;
  previous?: BaseContract | null;
  next?: BaseContract | null;
  duplicateCommission?: any | null;
  terminateDate?: any | null;
  terminatePremium?: any | null;
  terminateCase?: TerminateCase | null;
  reissuanceDate?: any | null;
  reissuanceType?: ReissuanceType | null;
  reissuanceDifference?: any | null;
  reissuanceSurcharge?: any | null;
  fixDate?: any | null;
  status?: BaseContractStatus | null;
  baseContractAcl?: BaseContractAcl[] | null;
  userpId?: any | null;
}
export type BaseContractViewName = "_base" | "_local" | "_minimal";
export type BaseContractView<V extends BaseContractViewName> = V extends "_base"
  ? Pick<
      BaseContract,
      | "id"
      | "contractNumber"
      | "productGroup"
      | "productSubGroup"
      | "product"
      | "insurantType"
      | "beneficiaryType"
      | "applicationNumber"
      | "applicationDate"
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
  : V extends "_local"
  ? Pick<
      BaseContract,
      | "id"
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
  ? Pick<BaseContract, "id" | "contractNumber">
  : never;
