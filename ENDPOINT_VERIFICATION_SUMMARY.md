# Endpoint Verification Summary - ECCLIVO Insurance Platform

## 📋 Executive Summary

All API endpoints have been verified and documented. The backend server address has been corrected to the actual production server, and URL construction issues have been fixed.

---

## ✅ Verified Information

### Base URL (CORRECTED)
- **Production:** `https://port.tys.uz/rest/v2/`
- **Development:** `https://dev2.tys.uz/rest/v2/`
- **Previously Incorrect:** `https://api.ecclivo.uz` (was hardcoded default in miniapp)

### Additional Service URLs
- **Identity Service:** `https://id.tys.uz/`
- **Info API:** `https://apip.tys.uz/`

### API Version
- **REST API Version:** v2

---

## 🔧 Changes Made

### 1. Fixed Miniapp Configuration
**File:** `telegram-miniapp/nuxt.config.ts`

**Before:**
```typescript
apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://api.ecclivo.uz"
```

**After:**
```typescript
apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://port.tys.uz/rest/v2/"
```

### 2. Updated Constants
**File:** `telegram-miniapp/utils/constants.ts`

**Before:**
```typescript
BASE_URL: 'https://api.ecclivo.uz'
```

**After:**
```typescript
BASE_URL: 'https://port.tys.uz/rest/v2/'
```

### 3. Fixed URL Construction
**File:** `telegram-miniapp/composables/useApi.ts`

**Issues Fixed:**
- Removed duplicate `/rest/` in service calls
- Changed: `url: '/rest/services/${serviceName}/${methodName}'`
- To: `url: 'services/${serviceName}/${methodName}'`

**Result:** URLs now correctly resolve to `https://port.tys.uz/rest/v2/services/...` instead of incorrect `https://port.tys.uz/rest/v2/rest/services/...`

### 4. Documentation Created
- ✅ `API_ENDPOINTS.md` - Comprehensive API documentation
- ✅ `API_QUICK_REFERENCE.md` - Quick reference guide
- ✅ `ENDPOINT_VERIFICATION_SUMMARY.md` - This verification summary

---

## 📊 Complete Endpoint List

### Authentication (2 endpoints)
1. `POST /oauth/token/` - Login and get OAuth token
2. `GET /userInfo/` - Get authenticated user information

### OsgoService (7 endpoints)
1. `GET /services/OsgoService/getOsgoDataVersion` - Check metadata version
2. `GET /services/OsgoService/getOsgoData` - Get all metadata (car types, periods, etc.)
3. `POST /services/OsgoService/getVehicle` - Verify vehicle by gov number & tech passport
4. `POST /services/OsgoService/getDriver` - Verify driver by passport & birth date
5. `POST /services/OsgoService/createOsgoApplication` - Create new insurance policy
6. `POST /services/OsgoService/updateOsgoApplication` - Update existing policy
7. `POST /services/OsgoService/getFundPolicy` - Get policy serial & number after payment

### PartyService (1 endpoint)
1. `POST /services/PartyService/getIndividualByPassport` - Verify individual by passport

### BillingService (3 endpoints)
1. `POST /services/BillingService/sendSmsPayme` - Send Payme payment link via SMS
2. `POST /services/BillingService/sendSmsClick` - Send Click payment link via SMS
3. `POST /services/BillingService/sendSmsUzum` - Send Uzum payment link via SMS

### Entity Operations (4 patterns)
1. `GET /entities/{entityName}/{id}?view={viewName}` - Fetch entity by ID with view
2. `POST /entities/{entity}` - Create new entity
3. `POST /entities/{entity}/search` - Search entities
4. `GET /entities/{entity}` - List entities

### File Operations (1 endpoint)
1. `POST /files` - Upload document or image file

---

## 💳 Payment Gateway URLs (External)

### Payme
- **URL:** `https://checkout.paycom.uz/`
- **Merchant ID:** `5c639cf2e6a51ca8439a4b47`
- **Format:** Base64 encode: `m={merchant};ac.contract_id={id};a={amount_tiyin};c={callback}`

### Click
- **URL:** `https://my.click.uz/services/pay/`
- **Service ID:** `21087`
- **Merchant ID:** `15199`
- **Format:** Query params: `?service_id=21087&merchant_id=15199&transaction_param={policy_id}&amount={sum}`

### Uzum (via Apelsin)
- **URL:** `https://www.apelsin.uz/open-service`
- **Service ID:** `498600611`
- **Format:** Query params: `?serviceId=498600611&userId={policy_id}&amount={amount_tiyin}`

---

## 🔐 Authentication Details

### Basic Auth (for OAuth endpoint)
```
Username: insurance-sMWk5btg
Password: ae9cd07c2f768108368968ab9c130651722750fcf301a4f91d2ac1341e63882c
```

### Bearer Token
All authenticated API requests require:
```
Authorization: Bearer {access_token}
```

---

## 🧪 Test Data (from .env.dev)

### Vehicle Test Data
- **Gov Number:** `01N355OB`
- **Tech Passport Series:** `AAG`
- **Tech Passport Number:** `0553439`

### Person Test Data
- **Passport Series:** `AA`
- **Passport Number:** `4896256`
- **Birth Date:** `1972-04-19`

### Company
- **INN:** `200555450`

### Temp Login Credentials
- **Username:** `998935286407`
- **Password:** `Abc123!@#`

---

## 📁 Entity Names Reference

| Type | Entity Name | View Name |
|------|-------------|-----------|
| OSGO Contract | `contract$Osgo` | `osgo-front-view` |
| Individual/Person | `base$Individual` | `individual-front-view` |
| Vehicle | `osgo_Vehicle` | - |
| Driver | `osgoDriver` | - |

---

## 🔄 Complete API Flow

### Step 1: Authentication
```http
POST https://port.tys.uz/rest/v2/oauth/token/
```

### Step 2: Get Metadata (Cache)
```http
GET https://port.tys.uz/rest/v2/services/OsgoService/getOsgoData
```

### Step 3: Verify Vehicle
```http
POST https://port.tys.uz/rest/v2/services/OsgoService/getVehicle
```

### Step 4: Verify Owner
```http
POST https://port.tys.uz/rest/v2/services/PartyService/getIndividualByPassport
```

### Step 5: Verify Drivers (for each)
```http
POST https://port.tys.uz/rest/v2/services/OsgoService/getDriver
```

### Step 6: Create Policy
```http
POST https://port.tys.uz/rest/v2/services/OsgoService/createOsgoApplication
```

### Step 7: Process Payment
Redirect to payment gateway OR send SMS link

### Step 8: Get Policy Number
```http
POST https://port.tys.uz/rest/v2/services/OsgoService/getFundPolicy
```

---

## 📊 Comparison: Website vs Miniapp

### ✅ Matches
- ✅ All service names identical
- ✅ All method names identical
- ✅ Request/response formats identical
- ✅ Entity names identical
- ✅ View names identical
- ✅ Authentication flow compatible

### ⚠️ Differences Found & Fixed
- ❌ **Miniapp had wrong base URL** → ✅ FIXED to production URL
- ❌ **URL construction created duplicate /rest/** → ✅ FIXED
- ⚠️ **Miniapp needs .env file** → Create with correct values

---

## 📝 Required Environment Variables

### For Miniapp (.env file needed)
```env
# Backend API (Production)
NUXT_PUBLIC_API_BASE=https://port.tys.uz/rest/v2/

# Backend API (Development - uncomment if needed)
# NUXT_PUBLIC_API_BASE=https://dev2.tys.uz/rest/v2/

# Payment Gateways
VITE_PAYME_CHECKOUT=https://checkout.paycom.uz/
VITE_PAYME_MERCHANT=5c639cf2e6a51ca8439a4b47

VITE_CLICK_CHECKOUT=https://my.click.uz/services/pay/
VITE_CLICK_SERVICE=21087
VITE_CLICK_MERCHANT=15199

VITE_UZUM_CHECKOUT=https://www.apelsin.uz/open-service
VITE_UZUM_SERVICE_ID=498600611

# Test Data (optional, for development)
VITE_VEHICLE_GOV_NUMBER=01N355OB
VITE_VEHICLE_TECH_PASSPORT_SERIES=AAG
VITE_VEHICLE_TECH_PASSPORT_NUMBER=0553439
VITE_PERSON_PASSPORT_SERIES=AA
VITE_PERSON_PASSPORT_NUMBER=4896256
VITE_PERSON_BIRTH_DATE=1972-04-19
```

---

## 📈 Total Endpoint Count

| Category | Count |
|----------|-------|
| Authentication | 2 |
| OsgoService | 7 |
| PartyService | 1 |
| BillingService | 3 |
| Entity Operations | 4 |
| File Operations | 1 |
| **Backend Total** | **18** |
| Payment Gateways (External) | 3 |
| **Grand Total** | **21** |

---

## ✅ Verification Status

- [x] Base URL identified and corrected
- [x] All endpoints documented with full URLs
- [x] Request/response formats documented
- [x] Authentication method documented
- [x] Payment gateway URLs documented
- [x] Test data extracted from .env files
- [x] Website and miniapp comparison completed
- [x] Miniapp configuration fixed with production URL
- [x] Constants updated to production URL
- [x] URL construction fixed (removed duplicate /rest/)
- [x] Comprehensive documentation created

---

## 🎯 Next Steps

1. ✅ **DONE:** Fix base URL in miniapp to production
2. ✅ **DONE:** Update constants to production URL
3. ✅ **DONE:** Fix URL construction (removed duplicate /rest/)
4. 📋 **TODO:** Create `.env` file for miniapp with correct values
5. 📋 **TODO:** Test all endpoints with updated configuration
6. 📋 **TODO:** Update any hardcoded URLs in components (if any)
7. 📋 **TODO:** Verify payment gateway integration

---

## 📚 Documentation Files Created

1. **API_ENDPOINTS.md** - Full technical documentation
   - All endpoints with request/response examples
   - Authentication details
   - Error handling
   - Entity references
   - Implementation notes

2. **API_QUICK_REFERENCE.md** - Quick reference guide
   - Endpoint summary
   - Common patterns
   - Environment variables
   - Step-by-step flow

3. **ENDPOINT_VERIFICATION_SUMMARY.md** - This file
   - Executive summary
   - Changes made
   - Verification checklist

---

## ⚠️ Important Notes

1. **Base URL:** 
   - Production: `https://port.tys.uz/rest/v2/`
   - Development: `https://dev2.tys.uz/rest/v2/`
   - NOT `https://api.ecclivo.uz` (old incorrect default)
2. **API Version:** All endpoints use REST API v2 (`/rest/v2/`)
3. **URL Construction:** Base URL already includes `/rest/v2/`, so paths should be relative like `services/OsgoService/getOsgoData`
4. **Payment URLs:** Uzum actually uses Apelsin service (`www.apelsin.uz`)
5. **Authentication:** OAuth token required for all API calls except login
6. **Metadata Caching:** Cache `getOsgoData` response in localStorage, validate with version check

---

## 🔍 Source Files Verified

### Website (Vue 3)
- ✅ `website/src/misc/rest.ts` - Core API wrapper
- ✅ `website/src/store/ecclivo.ts` - OSGO state management
- ✅ `website/src/components/ecclivo/*.vue` - UI components
- ✅ `website/.env.dev` - Environment configuration

### Miniapp (Nuxt 3)
- ✅ `telegram-miniapp/composables/useApi.ts` - API composable
- ✅ `telegram-miniapp/utils/constants.ts` - Constants
- ✅ `telegram-miniapp/nuxt.config.ts` - Nuxt configuration

---

**Verification Date:** 2024
**Status:** ✅ COMPLETE
**Verified By:** Code Analysis & Environment Files (.env & .env.dev)
**Production Server:** https://port.tys.uz/rest/v2/
**Development Server:** https://dev2.tys.uz/rest/v2/