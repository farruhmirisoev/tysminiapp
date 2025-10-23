import { Contract } from "./base/base$Contract";
import { OrganizationExt } from "./base$OrganizationExt";
import { DicCurrency } from "./base/base$DicCurrency";
import { ContractGroupExt } from "./base$ContractGroupExt";
import { Group } from "./product_Group";
import { SubGroup } from "./product_SubGroup";
import { Product } from "./product_Product";
import { Party } from "./base/base$Party";
import { ContractExtBeneficiary } from "./ContractExtBeneficiary";
import {
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
import { ContractExtPaymentGraph } from "./ContractExtPaymentGraph";
import { AgentAgreement } from "./AgentAgreement";
import { ContractExtAgentAgreement } from "./ContractExtAgentAgreement";
import { ContractExtInsuranceType } from "./ContractExtInsuranceType";
import { ContractExtObject } from "./ContractExtObject";
import { Policy } from "./base$Policy";
import { CustomsDepartment } from "./customs$Department";
import { ContractExtAcl } from "./ContractExtAcl";
import { LoanContract } from "./LoanContract";
export class ContractExt extends Contract {
  static NAME = "base$ContractExt";
  organization?: OrganizationExt | null;
  currencyContract?: DicCurrency | null;
  group?: ContractGroupExt | null;
  productGroup?: Group | null;
  productSubGroup?: SubGroup | null;
  product?: Product | null;
  beneficiaryType?: any | null;
  beneficiary?: Party | null;
  beneficiaries?: ContractExtBeneficiary[] | null;
  applicationNumber?: string | null;
  applicationDate?: any | null;
  currencyLiability?: DicCurrency | null;
  limitOfLiability?: any | null;
  limitOfLiabilityCondition?: LimitOfLiability | null;
  damageCompensationTerm?: DamageCompensationTerm | null;
  franchiseUse?: boolean | null;
  franchiseBase?: FranchiseBase | null;
  franchiseType?: FranchiseType | null;
  franchiseUnit?: FranchiseUnit | null;
  franchise?: any | null;
  currencyPremium?: DicCurrency | null;
  premium?: any | null;
  commission?: any | null;
  paymentGraphType?: PaymentGraph | null;
  paymentGraph?: ContractExtPaymentGraph[] | null;
  distributionMethod?: DistributionMethod | null;
  agentAgreement?: AgentAgreement | null;
  agentAgreementList?: ContractExtAgentAgreement[] | null;
  insuranceType?: ContractExtInsuranceType[] | null;
  insuranceObjects?: ContractExtObject[] | null;
  policy?: Policy | null;
  policyDate?: any | null;
  policies?: Policy[] | null;
  duplicateCommission?: any | null;
  terminateDate?: any | null;
  terminatePremium?: any | null;
  terminateCase?: TerminateCase | null;
  reissuanceDate?: any | null;
  reissuanceType?: ReissuanceType | null;
  reissuanceDifference?: any | null;
  reissuanceSurcharge?: any | null;
  customsDepartment?: CustomsDepartment | null;
  customsSent?: boolean | null;
  insuranceObject?: string | null;
  status?: BaseContractStatus | null;
  contractExtAcl?: ContractExtAcl[] | null;
  previous?: ContractExt | null;
  next?: ContractExt | null;
  loanContracts?: LoanContract[] | null;
  serviceResponse?: string | null;
  errorMessage?: string | null;
}
export type ContractExtViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "baseContractFrontBrowseView"
  | "baseContractGetPolicy"
  | "contractExt-copy-view"
  | "contractExt-report-view"
  | "contractExt-view";
export type ContractExtView<V extends ContractExtViewName> = V extends "_base"
  ? Pick<
      ContractExt,
      | "id"
      | "contractNumber"
      | "beneficiaryType"
      | "applicationNumber"
      | "applicationDate"
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
      | "duplicateCommission"
      | "terminateDate"
      | "terminatePremium"
      | "terminateCase"
      | "reissuanceDate"
      | "reissuanceType"
      | "reissuanceDifference"
      | "reissuanceSurcharge"
      | "customsSent"
      | "insuranceObject"
      | "status"
      | "serviceResponse"
      | "errorMessage"
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
      ContractExt,
      | "id"
      | "beneficiaryType"
      | "applicationNumber"
      | "applicationDate"
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
      | "duplicateCommission"
      | "terminateDate"
      | "terminatePremium"
      | "terminateCase"
      | "reissuanceDate"
      | "reissuanceType"
      | "reissuanceDifference"
      | "reissuanceSurcharge"
      | "customsSent"
      | "insuranceObject"
      | "status"
      | "serviceResponse"
      | "errorMessage"
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
  ? Pick<ContractExt, "id" | "contractNumber">
  : V extends "baseContractFrontBrowseView"
  ? Pick<
      ContractExt,
      | "id"
      | "contractNumber"
      | "product"
      | "party"
      | "contractStartDate"
      | "contractEndDate"
      | "limitOfLiability"
      | "premium"
      | "policy"
      | "contractDate"
      | "status"
    >
  : V extends "baseContractGetPolicy"
  ? Pick<
      ContractExt,
      | "id"
      | "contractNumber"
      | "contractStartDate"
      | "contractEndDate"
      | "limitOfLiability"
      | "premium"
      | "policy"
      | "party"
    >
  : V extends "contractExt-copy-view"
  ? Pick<
      ContractExt,
      | "id"
      | "beneficiaryType"
      | "applicationNumber"
      | "applicationDate"
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
      | "duplicateCommission"
      | "terminateDate"
      | "terminatePremium"
      | "terminateCase"
      | "reissuanceDate"
      | "reissuanceType"
      | "reissuanceDifference"
      | "reissuanceSurcharge"
      | "customsSent"
      | "insuranceObject"
      | "status"
      | "serviceResponse"
      | "errorMessage"
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
      | "product"
      | "party"
      | "beneficiary"
      | "beneficiaries"
      | "organization"
      | "group"
      | "productSubGroup"
      | "productGroup"
      | "customsDepartment"
    >
  : V extends "contractExt-report-view"
  ? Pick<
      ContractExt,
      | "id"
      | "contractNumber"
      | "party"
      | "beneficiary"
      | "contractDate"
      | "policy"
      | "next"
      | "loanContracts"
      | "product"
    >
  : V extends "contractExt-view"
  ? Pick<
      ContractExt,
      | "id"
      | "beneficiaryType"
      | "applicationNumber"
      | "applicationDate"
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
      | "duplicateCommission"
      | "terminateDate"
      | "terminatePremium"
      | "terminateCase"
      | "reissuanceDate"
      | "reissuanceType"
      | "reissuanceDifference"
      | "reissuanceSurcharge"
      | "customsSent"
      | "insuranceObject"
      | "status"
      | "serviceResponse"
      | "errorMessage"
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
      | "product"
    >
  : never;
