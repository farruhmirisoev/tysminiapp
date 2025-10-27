# API Endpoints Documentation - ECCLIVO Telegram Mini App

## Base URL

**Production:** `https://port.tys.uz/rest/v2/`
**Development:** `https://dev2.tys.uz/rest/v2/`

The base URL is configurable via environment variable:
- Nuxt Config: `NUXT_PUBLIC_API_BASE`
- Website (Vite): `VITE_API_BASE_URL`

**Additional URLs:**
- Identity Service: `https://id.tys.uz/`
- Info Service: `https://apip.tys.uz/`

---

## Authentication

### OAuth Token
**Endpoint:** `POST https://port.tys.uz/rest/v2/oauth/token/`

**Description:** Obtain authentication token using username and password

**Request Body:**
```json
{
  "grant_type": "password",
  "username": "998935286407",
  "password": "Abc123!@#"
}
```

**Headers:**
```
Authorization: Basic {BASIC_AUTH_CREDENTIALS}
Content-Type: multipart/form-data
```

**Basic Auth Credentials (from .env.dev):**
- Username: `insurance-sMWk5btg`
- Password: `ae9cd07c2f768108368968ab9c130651722750fcf301a4f91d2ac1341e63882c`

**Response:**
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Note:** Mini app uses Telegram authentication instead of username/password. Temp credentials provided for development only.

---

## User Info

### Get User Information
**Endpoint:** `GET https://port.tys.uz/rest/v2/userInfo/`

**Description:** Fetch authenticated user information

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  ...
}
```

---

## OSGO Service (Insurance Operations)

Base path: `https://port.tys.uz/rest/v2/services/OsgoService/`

### 1. Get OSGO Data Version
**Endpoint:** `GET https://port.tys.uz/rest/v2/services/OsgoService/getOsgoDataVersion`

**Description:** Check version of metadata to determine if local cache needs update

**Response:**
```json
{
  "data": 123
}
```

---

### 2. Get OSGO Data (Metadata)
**Endpoint:** `GET https://port.tys.uz/rest/v2/services/OsgoService/getOsgoData`

**Description:** Fetch all metadata including car types, periods, regions, incident frequencies, etc.

**Response:**
```json
{
  "data": {
    "version": 123,
    "carType": [
      {
        "id": "uuid",
        "name": "Легковой автомобиль",
        "nameUz": "Yengil avtomobil",
        "coefficient": 0.1,
        "tariffCompany": 100000,
        "order": 1
      }
    ],
    "period": [
      {
        "id": "uuid",
        "name": "1 год",
        "nameUz": "1 yil",
        "periodType": "ONE_YEAR",
        "months": 12,
        "coefficient": 1,
        "order": 1
      }
    ],
    "drivedArea": [
      {
        "id": "uuid",
        "name": "Ташкент",
        "nameUz": "Toshkent",
        "vehicleRegionCode": 10,
        "coefficient": 1.4,
        "order": 1
      }
    ],
    "incidentFrequency": [
      {
        "id": "uuid",
        "name": "Без ДТП",
        "nameUz": "YTH yo'q",
        "coefficient": 1,
        "order": 1
      }
    ],
    "beneficiary": [
      {
        "id": "uuid",
        "name": "Владелец",
        "nameUz": "Egasi",
        "coefficient": 1,
        "order": 1
      }
    ],
    "relative": [
      {
        "id": "uuid",
        "name": "Родственник",
        "nameUz": "Qarindosh",
        "order": 1
      }
    ],
    "periodType": [...]
  }
}
```

**Cache Key:** `ecclivo-meta` or `ECCLIVO` (localStorage)

---

### 3. Get Vehicle
**Endpoint:** `POST https://port.tys.uz/rest/v2/services/OsgoService/getVehicle`

**Description:** Verify and retrieve vehicle information from government database

**Request Body:**
```json
{
  "vehicleType": {
    "govNumber": "01A123BB",
    "techPassportSeria": "AAA",
    "techPassportNumber": "1234567"
  }
}
```

**Response:**
```json
{
  "data": {
    "result": {
      "id": "uuid",
      "govNumber": "01A123BB",
      "techPassportSeries": "AAA",
      "techPassportNumber": "1234567",
      "techPassportIssueDate": "2020-01-15",
      "modelName": "Chevrolet Cobalt",
      "createdYear": 2020,
      "engineNumber": "ABC123456",
      "bodyNumber": "XYZ789012",
      "carType": {
        "id": "uuid",
        "name": "Легковой автомобиль"
      }
    },
    "error": null
  }
}
```

**Error Response:**
```json
{
  "data": {
    "error": {
      "message": "Транспортное средство не найдено"
    },
    "result": null
  }
}
```

---

### 4. Get Driver
**Endpoint:** `POST https://port.tys.uz/rest/v2/services/OsgoService/getDriver`

**Description:** Verify and retrieve driver information including license details

**Request Body:**
```json
{
  "passportBirthDateType": {
    "passportSeries": "AA",
    "passportNumber": "1234567",
    "birthDate": "1990-01-01",
    "isConsent": "Y"
  }
}
```

**Response:**
```json
{
  "data": {
    "result": {
      "id": "uuid",
      "passportSeries": "AA",
      "passportNumber": "1234567",
      "passportIssueDate": "2010-05-20",
      "passportIssuedBy": "Министерство внутренних дел",
      "birthDate": "1990-01-01",
      "pinfl": "12345678901234",
      "firstName": "Иван",
      "lastName": "Иванов",
      "middleName": "Иванович",
      "gender": "MALE",
      "address": "г. Ташкент, ул. Мирабад, д. 10",
      "licenseSeries": "AAA",
      "licenseNumber": "123456",
      "licenseDate": "2015-03-10",
      "incidentFrequency": {
        "id": "uuid",
        "coefficient": 1
      }
    },
    "error": null
  }
}
```

---

### 5. Create OSGO Application
**Endpoint:** `POST https://port.tys.uz/rest/v2/services/OsgoService/createOsgoApplication`

**Description:** Create a new insurance policy application

**Request Body:**
```json
{
  "user": {
    "id": "uuid"
  },
  "osgo": {
    "status": "DRAFT",
    "vehicle": {
      "id": "vehicle-uuid",
      "carType": {
        "id": "cartype-uuid"
      }
    },
    "party": {
      "id": "individual-uuid",
      "phone": "998901234567"
    },
    "beneficiary": {
      "id": "owner-uuid"
    },
    "drivers": [
      {
        "id": "driver-uuid",
        "relative": {
          "id": "relative-uuid"
        }
      }
    ],
    "period": {
      "id": "period-uuid"
    },
    "periodType": "ONE_YEAR",
    "drivedArea": {
      "id": "area-uuid"
    },
    "driversLimited": true,
    "incidentCoeff": 1,
    "discountType": {
      "id": "discount-uuid"
    },
    "contractStartDate": "2024-01-15",
    "contractEndDate": "2025-01-14",
    "applicantIsOwner": true
  }
}
```

**Response:**
```json
{
  "data": {
    "result": {
      "id": "policy-uuid"
    },
    "error": null
  }
}
```

---

### 6. Update OSGO Application
**Endpoint:** `POST https://port.tys.uz/rest/v2/services/OsgoService/updateOsgoApplication`

**Description:** Update existing insurance policy application

**Request Body:** (Same structure as Create)

**Response:**
```json
{
  "data": {
    "result": true,
    "error": null
  }
}
```

---

### 7. Get Fund Policy
**Endpoint:** `POST https://port.tys.uz/rest/v2/services/OsgoService/getFundPolicy`

**Description:** Retrieve policy number and series after successful payment

**Request Body:**
```json
{
  "id": "policy-uuid"
}
```

**Response:**
```json
{
  "data": {
    "result": {
      "seria": "ETSL",
      "number": "0001234"
    },
    "error": null
  }
}
```

**Error Response (when not paid):**
```json
{
  "data": {
    "error": {
      "message": "Полис еще не оплачен"
    },
    "result": null
  }
}
```

---

## Party Service (Individual/Owner Operations)

Base path: `https://port.tys.uz/rest/v2/services/PartyService/`

### Get Individual by Passport
**Endpoint:** `POST https://port.tys.uz/rest/v2/services/PartyService/getIndividualByPassport`

**Description:** Verify and retrieve individual information from government registry

**Request Body:**
```json
{
  "passport": {
    "passportSeries": "AA",
    "passportNumber": "1234567",
    "birthDate": "1985-03-15",
    "isConsent": "Y"
  }
}
```

**Response:**
```json
{
  "data": {
    "result": {
      "id": "uuid",
      "passportSeries": "AA",
      "passportNumber": "1234567",
      "passportIssueDate": "2005-08-20",
      "passportIssuedBy": "ГУВД г. Ташкента",
      "birthDate": "1985-03-15",
      "nationalIdentifier": "12345678901234",
      "firstName": "Петр",
      "lastName": "Петров",
      "middleName": "Петрович",
      "gender": "MALE",
      "name": "Петров Петр Петрович",
      "country": {
        "id": "uuid",
        "langValue1": "Узбекистан"
      },
      "region": {
        "id": "uuid",
        "langValue1": "Ташкент"
      },
      "district": {
        "id": "uuid",
        "langValue1": "Юнусабадский район"
      },
      "street": "ул. Бабура, д. 5, кв. 10"
    },
    "error": null
  }
}
```

---

## Entity Operations

Base path: `https://port.tys.uz/rest/v2/entities/`

### Fetch Entity by ID
**Endpoint:** `GET https://port.tys.uz/rest/v2/entities/{entityName}/{id}?view={viewName}`

**Description:** Retrieve specific entity with detailed view

**Examples:**

#### 1. Fetch OSGO Contract
```
GET https://port.tys.uz/rest/v2/entities/contract$Osgo/{id}?view=osgo-front-view
```

**Response:**
```json
{
  "id": "uuid",
  "status": "SIGNED",
  "premium": 500000,
  "contractStartDate": "2024-01-15",
  "contractEndDate": "2025-01-14",
  "driversLimited": true,
  "applicantIsOwner": true,
  "vehicle": {
    "id": "uuid"
  },
  "party": {
    "id": "uuid"
  },
  "beneficiary": {
    "id": "uuid"
  },
  "drivers": [...],
  "period": {...},
  "drivedArea": {...},
  "entriesJournalKt": [
    {
      "amount": 500000,
      "date": "2024-01-15"
    }
  ]
}
```

#### 2. Fetch Individual
```
GET https://port.tys.uz/rest/v2/entities/base$Individual/{id}?view=individual-front-view
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Иванов Иван Иванович",
  "passportSeries": "AA",
  "passportNumber": "1234567",
  "birthDate": "1990-01-01",
  "phone": "998901234567",
  ...
}
```

---

## Billing Service (Payment Operations)

Base path: `https://port.tys.uz/rest/v2/services/BillingService/`

### 1. Send SMS Payment Link - Payme
**Endpoint:** `POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsPayme`

**Description:** Send payment link via SMS using Payme

**Request Body:**
```json
{
  "object": {
    "phone": "998901234567",
    "contractId": "policy-uuid",
    "amount": 500000
  }
}
```

**Response:**
```json
{
  "data": {
    "success": true,
    "error": null
  }
}
```

---

### 2. Send SMS Payment Link - Click
**Endpoint:** `POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsClick`

**Description:** Send payment link via SMS using Click

**Request Body:** (Same as Payme)

**Response:** (Same as Payme)

---

### 3. Send SMS Payment Link - Uzum
**Endpoint:** `POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsUzum`

**Description:** Send payment link via SMS using Uzum

**Request Body:** (Same as Payme)

**Response:** (Same as Payme)

---

## File Operations

### Upload File
**Endpoint:** `POST https://port.tys.uz/rest/v2/files`

**Description:** Upload document or image file

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <binary>
```

**Response:**
```json
{
  "id": "file-uuid",
  "name": "document.pdf",
  "size": 102400,
  "contentType": "application/pdf",
  "uploadDate": "2024-01-15T10:30:00Z"
}
```

---

## Query Operations

Base path: `https://port.tys.uz/rest/v2/queries/`

### Invoke Query
**Endpoint:** `GET|POST https://port.tys.uz/rest/v2/queries/{queryName}/{methodName}`

**Description:** Execute custom queries (not currently used in mini app)

---

## Payment Gateway URLs

### Payme Checkout
**URL:** `https://checkout.paycom.uz/{encoded_params}`

**Parameters (Base64 encoded):**
```
m={merchant_id};ac.contract_id={policy_id};a={amount_in_tiyin};c={callback_url}
```

**Environment Variables:**
- `VITE_PAYME_CHECKOUT` - Payme checkout URL
- `VITE_PAYME_MERCHANT` - Merchant ID

---

### Click Checkout
**URL:** `https://my.click.uz/services/pay/`

**Query Parameters:**
- `service_id` - Click service ID
- `merchant_id` - Merchant ID
- `transaction_param` - Policy ID
- `amount` - Amount in sum

**Environment Variables:**
- `VITE_CLICK_CHECKOUT` - Click checkout URL
- `VITE_CLICK_SERVICE` - Service ID
- `VITE_CLICK_MERCHANT` - Merchant ID

---

### Uzum Checkout
**URL:** `https://www.apelsin.uz/open-service`

**Query Parameters:**
- `serviceId` - Uzum service ID
- `userId` - Policy ID
- `amount` - Amount in tiyin

**Environment Variables:**
- `VITE_UZUM_CHECKOUT=https://www.apelsin.uz/open-service`
- `VITE_UZUM_SERVICE_ID=498600611`

**Note:** Uzum uses Apelsin service for payment processing

---

## Entity Names Reference

| Entity Type | Entity Name |
|------------|-------------|
| OSGO Contract | `contract$Osgo` |
| Individual/Person | `base$Individual` |
| Vehicle | `osgo_Vehicle` |
| Driver | `osgoDriver` |
| Entries Journal | `accounting$EntriesJournal` |

---

## View Names Reference

| Entity | View Name | Description |
|--------|-----------|-------------|
| OSGO | `osgo-front-view` | Full contract details for frontend |
| Individual | `individual-front-view` | Full person details for frontend |

---

## Common Headers

All authenticated requests should include:

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

For multipart uploads:
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

---

## Error Response Format

All API errors follow this structure:

```json
{
  "data": {
    "error": {
      "message": "Human readable error message",
      "code": "ERROR_CODE",
      "details": {}
    },
    "result": null
  }
}
```

Or for HTTP errors:

```json
{
  "response": {
    "status": 400,
    "data": {
      "error": "Error description",
      "message": "Detailed error message",
      "error_description": "OAuth error description"
    }
  }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Entity not found |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## Implementation Notes

### Website (Vue 3 + Vite)
- Uses axios for HTTP requests
- Base URL: `import.meta.env.VITE_API_BASE_URL`
  - Production: `https://port.tys.uz/rest/v2/`
  - Development: `https://dev2.tys.uz/rest/v2/`
- Token storage: `localStorage` via `token.ts`
- Main API wrapper: `src/misc/rest.ts`
- Basic Auth: Uses credentials from env for OAuth

### Mini App (Nuxt 3)
- Uses axios for HTTP requests
- Base URL: `process.env.NUXT_PUBLIC_API_BASE`
  - Default: `https://port.tys.uz/rest/v2/` ✅ UPDATED
- Token storage: `localStorage` with key `auth-token`
- Main API composable: `composables/useApi.ts`
- Constants: `utils/constants.ts`

### Authentication Flow
1. **Website:** Login with phone + password → Get OAuth token → Store in localStorage
2. **Mini App:** (Current) Temp credentials OR (Future) Telegram initData validation

### Data Flow
1. Fetch metadata (getOsgoData) → Cache in localStorage
2. Verify vehicle → Get vehicle details
3. Verify owner → Get owner details  
4. Verify drivers → Get driver details
5. Create/Update application
6. Process payment
7. Fetch fund policy (serial + number)

---

## API Versioning

Current version: `/rest/v2/`

All endpoints use v2 of the REST API

---

## Rate Limiting

Not specified in current implementation. Consider implementing:
- Max 100 requests per minute per user
- Max 10 requests per second per IP

---

## Caching Strategy

### Metadata (OSGO Data)
- Cache key: `ecclivo-meta` or `ECCLIVO`
- TTL: Until version changes
- Storage: localStorage
- Validation: Compare version with `getOsgoDataVersion`

### Auth Token
### Token Cache
- Cache key: `auth-token`
- TTL: Until expiry (typically 1 hour)
- Storage: localStorage
- Invalidation: On 401 response

### Test Data (from .env.dev)
- **Vehicle:** Gov# `01N355OB`, Tech Passport `AAG-0553439`
- **Person:** Passport `AA-4896256`, Birth Date `1972-04-19`
- **Company INN:** `200555450`

---

## Testing Endpoints

Use temporary credentials for development:
- **Username:** `998935286407`
- **Password:** `Abc123!@#`

**⚠️ WARNING:** Remove these credentials in production!

---

## Summary of All Endpoints

### Authentication
- `POST https://port.tys.uz/rest/v2/oauth/token/` - Get OAuth token
- `GET https://port.tys.uz/rest/v2/userInfo/` - Get user info

### OsgoService (7 endpoints)
- `GET https://port.tys.uz/rest/v2/services/OsgoService/getOsgoDataVersion` - Check metadata version
- `GET https://port.tys.uz/rest/v2/services/OsgoService/getOsgoData` - Get all metadata
- `POST https://port.tys.uz/rest/v2/services/OsgoService/getVehicle` - Verify vehicle
- `POST https://port.tys.uz/rest/v2/services/OsgoService/getDriver` - Verify driver
- `POST https://port.tys.uz/rest/v2/services/OsgoService/createOsgoApplication` - Create policy
- `POST https://port.tys.uz/rest/v2/services/OsgoService/updateOsgoApplication` - Update policy
- `POST https://port.tys.uz/rest/v2/services/OsgoService/getFundPolicy` - Get policy number

### PartyService (1 endpoint)
- `POST https://port.tys.uz/rest/v2/services/PartyService/getIndividualByPassport` - Verify individual

### BillingService (3 endpoints)
- `POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsPayme` - Send Payme link
- `POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsClick` - Send Click link
- `POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsUzum` - Send Uzum link

### Entity Operations
- `GET https://port.tys.uz/rest/v2/entities/{entityName}/{id}?view={viewName}` - Fetch entity
- `POST https://port.tys.uz/rest/v2/entities/{entity}` - Create entity
- `POST https://port.tys.uz/rest/v2/entities/{entity}/search` - Search entities
- `GET https://port.tys.uz/rest/v2/entities/{entity}` - List entities

### File Operations
- `POST https://port.tys.uz/rest/v2/files` - Upload file

### Payment Gateways (External)
- Payme: `https://checkout.paycom.uz/` (Merchant: `5c639cf2e6a51ca8439a4b47`)
- Click: `https://my.click.uz/services/pay/` (Service: `21087`, Merchant: `15199`)
- Uzum/Apelsin: `https://www.apelsin.uz/open-service` (Service: `498600611`)

---

**Total API Endpoints Used:** 16 backend + 3 payment gateways = **19 endpoints**

**Base URL (Production):** `https://port.tys.uz/rest/v2/`
**Base URL (Development):** `https://dev2.tys.uz/rest/v2/`

---

## ✅ Configuration Updated

The Nuxt miniapp configuration has been updated:

**Current (CORRECT):**
```typescript
apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://port.tys.uz/rest/v2/"
```

**Environment Variables:**
```env
# Production
NUXT_PUBLIC_API_BASE=https://port.tys.uz/rest/v2/

# Development
NUXT_PUBLIC_API_BASE=https://dev2.tys.uz/rest/v2/
```
