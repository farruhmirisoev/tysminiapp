import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
import { Group } from "./product_Group";
import { SubGroup } from "./product_SubGroup";
import { InventoryType } from "./inventory_Type";
import { Party } from "./base/base$Party";
import {
  FranchiseType,
  FranchiseBase,
  FranchiseUnit,
  LimitOfLiability,
  DamageCompensationTerm,
  State,
  IntentType,
} from "../enums/enums";
import { ProductType } from "./product_Type";
import { ProductObject } from "./ProductObject";
import { ProductUser } from "./productProductUser";
import { InsuranceRisk } from "./reference_InsuranceRisk";
export class Product extends BaseLongIdEntity {
  static NAME = "product_Product";
  group?: Group | null;
  subGroup?: SubGroup | null;
  isGeneralContract?: boolean | null;
  isEPolicy?: boolean | null;
  number?: string | null;
  date?: any | null;
  name?: string | null;
  nameUz?: string | null;
  code?: string | null;
  prefix?: string | null;
  inventoryTypes?: InventoryType[] | null;
  minimumDay?: number | null;
  maximumDay?: number | null;
  dateBegin?: any | null;
  dateEnd?: any | null;
  partyType?: any | null;
  fixClientCheck?: boolean | null;
  fixClient?: Party | null;
  fixBeneficiaryCheck?: boolean | null;
  fixBeneficiary?: Party | null;
  franchiseUse?: boolean | null;
  franchiseFix?: boolean | null;
  franchiseType?: FranchiseType | null;
  franchiseBase?: FranchiseBase | null;
  franchiseUnit?: FranchiseUnit | null;
  franchise?: any | null;
  franchiseTypeCheck?: boolean | null;
  franchiseBaseCheck?: boolean | null;
  franchiseUnitCheck?: boolean | null;
  limitOfLiabilityCheck?: boolean | null;
  limitOfLiability?: LimitOfLiability | null;
  limitOfLiabilityFixSumCheck?: boolean | null;
  limitOfLiabilityFixSum?: any | null;
  damageCompensationTermCheck?: boolean | null;
  damageCompensationTerm?: DamageCompensationTerm | null;
  comment?: string | null;
  state?: State | null;
  paymentGraph?: string | null;
  insuranceType?: ProductType[] | null;
  objectType?: ProductObject[] | null;
  user?: ProductUser[] | null;
  risks?: InsuranceRisk[] | null;
  applicationVisibility?: boolean | null;
  selectBeneficiary?: boolean | null;
  showInsuranceType?: boolean | null;
  editInsuranceType?: boolean | null;
  multiAgent?: boolean | null;
  multiPolicy?: boolean | null;
  multiPay?: boolean | null;
  currencyAllow?: boolean | null;
  loanCheck?: boolean | null;
  loanToLiabilityCoefficient?: any | null;
  liabilityDecision?: number | null;
  reportCodeApplication?: string | null;
  reportCodeContract?: string | null;
  reportCodePolicy?: string | null;
  customsIntent?: IntentType | null;
  createTs?: any | null;
  createdBy?: string | null;
  deleteTs?: any | null;
  deletedBy?: string | null;
  updateTs?: any | null;
  updatedBy?: string | null;
  version?: number | null;
  tariff?: string | null;
  loanTabVisibility?: boolean | null;
  insuranceTypesTabVisibility?: boolean | null;
  franchiseBoxVisibility?: boolean | null;
  paymentGraphVisibility?: boolean | null;
  readonly?: boolean | null;
}
export type ProductViewName = "_base" | "_local" | "_minimal" | "product-view";
export type ProductView<V extends ProductViewName> = V extends "_base"
  ? Pick<
      Product,
      | "id"
      | "name"
      | "isGeneralContract"
      | "isEPolicy"
      | "number"
      | "date"
      | "nameUz"
      | "code"
      | "prefix"
      | "minimumDay"
      | "maximumDay"
      | "dateBegin"
      | "dateEnd"
      | "partyType"
      | "fixClientCheck"
      | "fixBeneficiaryCheck"
      | "franchiseUse"
      | "franchiseFix"
      | "franchiseType"
      | "franchiseBase"
      | "franchiseUnit"
      | "franchise"
      | "franchiseTypeCheck"
      | "franchiseBaseCheck"
      | "franchiseUnitCheck"
      | "limitOfLiabilityCheck"
      | "limitOfLiability"
      | "limitOfLiabilityFixSumCheck"
      | "limitOfLiabilityFixSum"
      | "damageCompensationTermCheck"
      | "damageCompensationTerm"
      | "comment"
      | "state"
      | "paymentGraph"
      | "applicationVisibility"
      | "selectBeneficiary"
      | "showInsuranceType"
      | "editInsuranceType"
      | "multiAgent"
      | "multiPolicy"
      | "multiPay"
      | "currencyAllow"
      | "loanCheck"
      | "loanToLiabilityCoefficient"
      | "liabilityDecision"
      | "reportCodeApplication"
      | "reportCodeContract"
      | "reportCodePolicy"
      | "customsIntent"
      | "tariff"
      | "loanTabVisibility"
      | "insuranceTypesTabVisibility"
      | "franchiseBoxVisibility"
      | "paymentGraphVisibility"
      | "readonly"
    >
  : V extends "_local"
  ? Pick<
      Product,
      | "id"
      | "isGeneralContract"
      | "isEPolicy"
      | "number"
      | "date"
      | "name"
      | "nameUz"
      | "code"
      | "prefix"
      | "minimumDay"
      | "maximumDay"
      | "dateBegin"
      | "dateEnd"
      | "partyType"
      | "fixClientCheck"
      | "fixBeneficiaryCheck"
      | "franchiseUse"
      | "franchiseFix"
      | "franchiseType"
      | "franchiseBase"
      | "franchiseUnit"
      | "franchise"
      | "franchiseTypeCheck"
      | "franchiseBaseCheck"
      | "franchiseUnitCheck"
      | "limitOfLiabilityCheck"
      | "limitOfLiability"
      | "limitOfLiabilityFixSumCheck"
      | "limitOfLiabilityFixSum"
      | "damageCompensationTermCheck"
      | "damageCompensationTerm"
      | "comment"
      | "state"
      | "paymentGraph"
      | "applicationVisibility"
      | "selectBeneficiary"
      | "showInsuranceType"
      | "editInsuranceType"
      | "multiAgent"
      | "multiPolicy"
      | "multiPay"
      | "currencyAllow"
      | "loanCheck"
      | "loanToLiabilityCoefficient"
      | "liabilityDecision"
      | "reportCodeApplication"
      | "reportCodeContract"
      | "reportCodePolicy"
      | "customsIntent"
      | "tariff"
      | "loanTabVisibility"
      | "insuranceTypesTabVisibility"
      | "franchiseBoxVisibility"
      | "paymentGraphVisibility"
      | "readonly"
    >
  : V extends "_minimal"
  ? Pick<Product, "id" | "name">
  : V extends "product-view"
  ? Pick<
      Product,
      | "id"
      | "isGeneralContract"
      | "isEPolicy"
      | "number"
      | "date"
      | "name"
      | "nameUz"
      | "code"
      | "prefix"
      | "minimumDay"
      | "maximumDay"
      | "dateBegin"
      | "dateEnd"
      | "partyType"
      | "fixClientCheck"
      | "fixBeneficiaryCheck"
      | "franchiseUse"
      | "franchiseFix"
      | "franchiseType"
      | "franchiseBase"
      | "franchiseUnit"
      | "franchise"
      | "franchiseTypeCheck"
      | "franchiseBaseCheck"
      | "franchiseUnitCheck"
      | "limitOfLiabilityCheck"
      | "limitOfLiability"
      | "limitOfLiabilityFixSumCheck"
      | "limitOfLiabilityFixSum"
      | "damageCompensationTermCheck"
      | "damageCompensationTerm"
      | "comment"
      | "state"
      | "paymentGraph"
      | "applicationVisibility"
      | "selectBeneficiary"
      | "showInsuranceType"
      | "editInsuranceType"
      | "multiAgent"
      | "multiPolicy"
      | "multiPay"
      | "currencyAllow"
      | "loanCheck"
      | "loanToLiabilityCoefficient"
      | "liabilityDecision"
      | "reportCodeApplication"
      | "reportCodeContract"
      | "reportCodePolicy"
      | "customsIntent"
      | "tariff"
      | "loanTabVisibility"
      | "insuranceTypesTabVisibility"
      | "franchiseBoxVisibility"
      | "paymentGraphVisibility"
      | "readonly"
      | "group"
      | "subGroup"
      | "insuranceType"
      | "fixClient"
      | "fixBeneficiary"
      | "inventoryTypes"
      | "objectType"
    >
  : never;
