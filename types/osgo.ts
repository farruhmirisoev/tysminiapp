// OSGO (Compulsory Motor Third Party Liability) Insurance Types

export enum BaseContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum OsgoPeriodType {
  ONE_YEAR = 'ONE_YEAR',
  SEASON = 'SEASON',
  TILL_REGISTRATION = 'TILL_REGISTRATION',
  FOREIGN = 'FOREIGN',
}

export interface CarType {
  id: string
  name: string
  nameUz: string
  order: number
  tariffCompany?: number
  coefficient?: number
}

export interface Period {
  id: string
  name: string
  nameUz: string
  order: number
  periodType: OsgoPeriodType
  coefficient: number
  months?: number
  days?: number
}

export interface IncidentFrequency {
  id: string
  name: string
  nameUz: string
  order: number
  coefficient: number
}

export interface DrivedArea {
  id: string
  name: string
  nameUz: string
  order: number
  coefficient: number
  vehicleRegionCode?: number
}

export interface Beneficiary {
  id: string
  name: string
  nameUz: string
  order: number
  coefficient: number
}

export interface Relative {
  id: string
  name: string
  nameUz: string
  order: number
}

export interface EcclivoMeta {
  version: number
  carType: CarType[]
  beneficiary: Beneficiary[]
  drivedArea: DrivedArea[]
  incidentFrequency: IncidentFrequency[]
  period: Period[]
  relative: Relative[]
  periodType: any[]
}

export interface Vehicle {
  id?: string
  govNumber: string
  techPassportSeries: string
  techPassportNumber: string
  carType?: CarType
  model?: string
  year?: number
  engineNumber?: string
  chassisNumber?: string
  bodyNumber?: string
  color?: string
  capacity?: number
  [key: string]: any
}

export interface Individual {
  id?: string
  passportSeries: string
  passportNumber: string
  birthDate: string
  name?: string
  firstName?: string
  lastName?: string
  middleName?: string
  address?: string
  phone?: string
  pinfl?: string
  [key: string]: any
}

export interface Driver {
  id?: string
  passportSeries: string
  passportNumber: string
  birthDate: string
  name?: string
  firstName?: string
  lastName?: string
  middleName?: string
  licenseNumber?: string
  licenseDate?: string
  address?: string
  incidentFrequency?: IncidentFrequency
  [key: string]: any
}

export interface EntriesJournal {
  id: string
  amount: number
  createdDate: string
  [key: string]: any
}

export interface Osgo {
  id?: string
  status: BaseContractStatus
  vehicle: Vehicle | null
  party: Individual | null // Applicant
  beneficiary: Individual | null // Owner
  applicantIsOwner: boolean
  drivers: Driver[]
  driversLimited: boolean
  incidentCoeff?: number
  period?: Period
  periodType?: OsgoPeriodType
  drivedArea?: DrivedArea
  contractStartDate: string
  contractEndDate?: string
  premium: number
  discountType?: any
  entriesJournalKt?: EntriesJournal[]
  [key: string]: any
}

export interface FundData {
  seria: string
  number: string
}

export interface OsgoFormData extends Osgo {
  owner: Individual
  applicant: Individual
}
