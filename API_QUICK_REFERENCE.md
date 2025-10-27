# API Quick Reference - ECCLIVO Insurance Mini App

## 🔗 Base URL
```
Production: https://port.tys.uz/rest/v2/
Development: https://dev2.tys.uz/rest/v2/
```

**Additional Services:**
- Identity: `https://id.tys.uz/`
- Info API: `https://apip.tys.uz/`

---

## 🔐 Authentication

### Login
```http
POST https://port.tys.uz/rest/v2/oauth/token/
Content-Type: multipart/form-data
Authorization: Basic insurance-sMWk5btg:ae9cd07c2f768108368968ab9c130651722750fcf301a4f91d2ac1341e63882c

Body:
- grant_type: password
- username: 998935286407
- password: Abc123!@#
```

**Basic Auth Credentials (from .env.dev):**
- Username: `insurance-sMWk5btg`
- Password: `ae9cd07c2f768108368968ab9c130651722750fcf301a4f91d2ac1341e63882c`

### All Authenticated Requests
```http
Authorization: Bearer {access_token}
```

---

## 📋 Core API Endpoints

### 1. **Metadata** (OsgoService)

#### Get Version
```http
GET https://port.tys.uz/rest/v2/services/OsgoService/getOsgoDataVersion
```

#### Get All Metadata
```http
GET https://port.tys.uz/rest/v2/services/OsgoService/getOsgoData
```
Returns: car types, periods, regions, incident frequencies, relatives, etc.

---

### 2. **Vehicle Verification** (OsgoService)

```http
POST https://port.tys.uz/rest/v2/services/OsgoService/getVehicle

{
  "vehicleType": {
    "govNumber": "01A123BB",
    "techPassportSeria": "AAA",
    "techPassportNumber": "1234567"
  }
}
```

---

### 3. **Owner Verification** (PartyService)

```http
POST https://port.tys.uz/rest/v2/services/PartyService/getIndividualByPassport

{
  "passport": {
    "passportSeries": "AA",
    "passportNumber": "1234567",
    "birthDate": "1990-01-01",
    "isConsent": "Y"
  }
}
```

---

### 4. **Driver Verification** (OsgoService)

```http
POST https://port.tys.uz/rest/v2/services/OsgoService/getDriver

{
  "passportBirthDateType": {
    "passportSeries": "AA",
    "passportNumber": "1234567",
    "birthDate": "1990-01-01",
    "isConsent": "Y"
  }
}
```

---

### 5. **Create Policy** (OsgoService)

```http
POST https://port.tys.uz/rest/v2/services/OsgoService/createOsgoApplication

{
  "user": { "id": "uuid" },
  "osgo": {
    "status": "DRAFT",
    "vehicle": { "id": "uuid", "carType": {...} },
    "party": { "id": "uuid", "phone": "998901234567" },
    "beneficiary": { "id": "uuid" },
    "drivers": [...],
    "period": { "id": "uuid" },
    "drivedArea": { "id": "uuid" },
    "contractStartDate": "2024-01-15",
    "contractEndDate": "2025-01-14",
    "driversLimited": true,
    "applicantIsOwner": true
  }
}
```
Returns: `{ "data": { "result": { "id": "policy-uuid" } } }`

---

### 6. **Update Policy** (OsgoService)

```http
POST https://port.tys.uz/rest/v2/services/OsgoService/updateOsgoApplication

{
  "osgo": { /* same structure as create */ }
}
```

---

### 7. **Get Policy Number** (OsgoService)

```http
POST https://port.tys.uz/rest/v2/services/OsgoService/getFundPolicy

{
  "id": "policy-uuid"
}
```
Returns: `{ "data": { "result": { "seria": "ETSL", "number": "0001234" } } }`

---

### 8. **Payment SMS Links** (BillingService)

#### Payme
```http
POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsPayme

{
  "object": {
    "phone": "998901234567",
    "contractId": "policy-uuid",
    "amount": 500000
  }
}
```

#### Click
```http
POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsClick
```
(Same body as Payme)

#### Uzum
```http
POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsUzum
```
(Same body as Payme)

---

### 9. **Entity Operations**

#### Fetch Entity
```http
GET https://port.tys.uz/rest/v2/entities/{entityName}/{id}?view={viewName}

Examples:
- https://port.tys.uz/rest/v2/entities/contract$Osgo/{id}?view=osgo-front-view
- https://port.tys.uz/rest/v2/entities/base$Individual/{id}?view=individual-front-view
```

---

## 💳 Payment Gateway URLs

### Payme
```
https://checkout.paycom.uz/{base64_encoded_params}

Params: m=5c639cf2e6a51ca8439a4b47;ac.contract_id={id};a={amount_tiyin};c={callback}
Merchant: 5c639cf2e6a51ca8439a4b47
```

### Click
```
https://my.click.uz/services/pay/?service_id=21087&merchant_id=15199&transaction_param={policy_id}&amount={sum}

Service ID: 21087
Merchant ID: 15199
```

### Uzum (Apelsin)
```
https://www.apelsin.uz/open-service?serviceId=498600611&userId={policy_id}&amount={amount_tiyin}

Service ID: 498600611
```

---

## 📝 Entity Names

| Type | Entity Name |
|------|-------------|
| Policy | `contract$Osgo` |
| Person | `base$Individual` |
| Vehicle | `osgo_Vehicle` |
| Driver | `osgoDriver` |

---

## 🔍 View Names

| Entity | View |
|--------|------|
| OSGO | `osgo-front-view` |
| Individual | `individual-front-view` |

---

## 🚨 Error Handling

### Service Response Format
```json
{
  "data": {
    "result": { /* success data */ },
    "error": {
      "message": "Error description",
      "code": "ERROR_CODE"
    }
  }
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## 🎯 Step-by-Step API Flow

1. **Login** → Get token
2. **Fetch Metadata** → `getOsgoData()` (cache locally)
3. **Step 1: Parameters** → Select from cached metadata
4. **Step 2: Vehicle** → `getVehicle()` → Verify
5. **Step 3: Owner** → `getIndividualByPassport()` → Verify
6. **Step 4: Drivers** → `getDriver()` for each → Verify
7. **Step 5: Summary** → `createOsgoApplication()` → Get policy ID
8. **Payment** → Send SMS link OR Redirect to gateway
9. **After Payment** → `getFundPolicy()` → Get serial & number

---

## 🗂️ Caching

### Metadata Cache
- **Key:** `ecclivo-meta`
- **When:** On first load
- **Update:** When version changes (`getOsgoDataVersion()`)
- **Contains:** All dropdowns, coefficients, options

### Token Cache
- **Key:** `auth-token`
- **When:** After login
- **Clear:** On 401 response

---

## ⚙️ Environment Variables

### Backend
```env
# Production
NUXT_PUBLIC_API_BASE=https://port.tys.uz/rest/v2/
VITE_API_BASE_URL=https://port.tys.uz/rest/v2/

# Development
# NUXT_PUBLIC_API_BASE=https://dev2.tys.uz/rest/v2/
# VITE_API_BASE_URL=https://dev2.tys.uz/rest/v2/

# Additional Services
VITE_ID_BASE_URL=https://id.tys.uz/
VITE_INFO_BASE_URL=https://apip.tys.uz/
```

### Basic Auth
```env
VITE_BASIC_AUTH_USERNAME=insurance-sMWk5btg
VITE_BASIC_AUTH_PASSWORD=ae9cd07c2f768108368968ab9c130651722750fcf301a4f91d2ac1341e63882c
```

### Payment Gateways
```env
# Payme
VITE_PAYME_CHECKOUT=https://checkout.paycom.uz/
VITE_PAYME_MERCHANT=5c639cf2e6a51ca8439a4b47

# Click
VITE_CLICK_CHECKOUT=https://my.click.uz/services/pay/
VITE_CLICK_SERVICE=21087
VITE_CLICK_MERCHANT=15199

# Uzum (Apelsin)
VITE_UZUM_CHECKOUT=https://www.apelsin.uz/open-service
VITE_UZUM_SERVICE_ID=498600611
```

### Test Data
```env
VITE_VEHICLE_GOV_NUMBER=01N355OB
VITE_VEHICLE_TECH_PASSPORT_SERIES=AAG
VITE_VEHICLE_TECH_PASSPORT_NUMBER=0553439

VITE_PERSON_PASSPORT_SERIES=AA
VITE_PERSON_PASSPORT_NUMBER=4896256
VITE_PERSON_BIRTH_DATE=1972-04-19

VITE_COMPANY_INN=200555450
```

---

## 📊 Total Endpoints Summary

| Service | Endpoint Count |
|---------|----------------|
| **OsgoService** | 7 |
| **PartyService** | 1 |
| **BillingService** | 3 |
| **Entity Operations** | 4 |
| **Auth** | 2 |
| **Payment Gateways** | 3 (external) |
| **TOTAL** | **20 endpoints** |

---

## ✅ Verification Status

- ✅ All endpoints match between website and miniapp
- ✅ Base URL Production: `https://port.tys.uz/rest/v2/`
- ✅ Base URL Development: `https://dev2.tys.uz/rest/v2/`
- ✅ Request/response formats are identical
- ✅ Authentication flow is compatible
- ✅ Service names and methods match exactly
- ✅ Entity names and views match exactly
- ✅ Miniapp configuration updated with production URL
- ✅ URL construction fixed (removed duplicate /rest/)

---

## 🔧 Implementation Files

### Website (Vue 3)
- `src/misc/rest.ts` - API wrapper
- `src/store/ecclivo.ts` - OSGO store
- `src/components/ecclivo/*.vue` - UI components

### Mini App (Nuxt 3)
- `composables/useApi.ts` - API composable
- `utils/constants.ts` - Constants & config
- `stores/osgo.ts` - OSGO store

---

**Last Updated:** 2024
**API Version:** v2 (REST)
**Base URL (Production):** https://port.tys.uz/rest/v2/
**Base URL (Development):** https://dev2.tys.uz/rest/v2/

---

## ✅ COMPLETED UPDATES

All configurations have been updated:

1. ✅ **Base URL corrected** from `https://api.ecclivo.uz` to `https://port.tys.uz/rest/v2/`
2. ✅ **URL construction fixed** - removed duplicate `/rest/` in path building
3. ✅ **nuxt.config.ts updated** with correct production URL
4. ✅ **constants.ts updated** with correct base URL
5. ✅ **useApi.ts fixed** - paths now use relative URLs without `/rest/` prefix

**Current Configuration:**
```typescript
// nuxt.config.ts
apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://port.tys.uz/rest/v2/"

// utils/constants.ts
BASE_URL: "https://port.tys.uz/rest/v2/"

// composables/useApi.ts
url: `services/${serviceName}/${methodName}` // No /rest/ prefix ✅
```