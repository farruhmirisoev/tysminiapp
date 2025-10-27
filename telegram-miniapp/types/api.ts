// API Response and Request Types

export interface ApiResponse<T = any> {
  data: T
  error?: ApiError
  result?: T
}

export interface ApiError {
  message: string
  code?: string | number
  details?: any
}

export interface ServiceInvokeParams {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
}

// OsgoService API Types
export interface GetVehicleParams {
  govNumber: string
  techPassportSeries: string
  techPassportNumber: string
}

export interface GetVehicleResponse {
  id?: string
  govNumber: string
  model?: string
  year?: number
  engineNumber?: string
  chassisNumber?: string
  bodyNumber?: string
  color?: string
  capacity?: number
  carType?: any
  [key: string]: any
}

export interface GetIndividualByPassportParams {
  passportSeries: string
  passportNumber: string
  birthDate: string
}

export interface GetIndividualByPassportResponse {
  id?: string
  passportSeries: string
  passportNumber: string
  birthDate: string
  name?: string
  firstName?: string
  lastName?: string
  middleName?: string
  address?: string
  pinfl?: string
  [key: string]: any
}

export interface GetDriverParams {
  passportSeries: string
  passportNumber: string
  birthDate: string
}

export interface GetDriverResponse {
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
  [key: string]: any
}

export interface CreateOsgoApplicationParams {
  vehicle: any
  party: any
  beneficiary: any
  applicantIsOwner: boolean
  drivers: any[]
  driversLimited: boolean
  incidentCoeff?: number
  period: any
  periodType: string
  drivedArea: any
  contractStartDate: string
  contractEndDate?: string
  premium: number
  discountType?: any
  [key: string]: any
}

export interface CreateOsgoApplicationResponse {
  result: {
    id: string
  }
  error?: ApiError
}

export interface UpdateOsgoApplicationParams extends CreateOsgoApplicationParams {
  id: string
}

export interface UpdateOsgoApplicationResponse {
  result: boolean
  error?: ApiError
}

export interface GetFundPolicyParams {
  id: string
}

export interface GetFundPolicyResponse {
  result?: {
    seria: string
    number: string
  }
  error?: {
    message: string
  }
}

export interface GetOsgoDataVersionResponse {
  data: number
}

export interface GetOsgoDataResponse {
  data: {
    version: number
    carType: any[]
    beneficiary: any[]
    drivedArea: any[]
    incidentFrequency: any[]
    period: any[]
    relative: any[]
    periodType: any[]
  }
}

// BillingService API Types
export interface PaymentParams {
  contractId: string
  amount: number
  phone: string
  paymentMethod: 'payme' | 'click' | 'uzum'
}

export interface PaymentResponse {
  data: {
    paymentUrl?: string
    transactionId?: string
    error?: any
  }
}

// Entity Fetch Types
export interface FetchEntityParams {
  id: string
  view?: string
}

export interface FetchEntityResponse<T> {
  data: T
}

// Auth Types
export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    email?: string
    [key: string]: any
  }
}

export interface TelegramInitData {
  query_id?: string
  user?: {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
    is_premium?: boolean
    photo_url?: string
  }
  auth_date: number
  hash: string
  [key: string]: any
}

// Error handling types
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationErrors {
  [field: string]: string
}
