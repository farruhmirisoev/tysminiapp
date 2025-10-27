# Final API Endpoints Summary - ECCLIVO Insurance Platform

## ✅ All Issues Resolved

### 🎯 Correct Production Base URL
```
https://port.tys.uz/rest/v2/
```

### 🛠️ Development Base URL
```
https://dev2.tys.uz/rest/v2/
```

---

## 🔧 Issues Found & Fixed

### ❌ Issue 1: Wrong Default Base URL
- **Was:** `https://api.ecclivo.uz` (incorrect, doesn't exist)
- **Now:** `https://port.tys.uz/rest/v2/` ✅

### ❌ Issue 2: Duplicate `/rest/` in URLs
- **Was:** `https://port.tys.uz/rest/v2/rest/services/...` (duplicate /rest/)
- **Now:** `https://port.tys.uz/rest/v2/services/...` ✅

### Files Updated:
1. ✅ `telegram-miniapp/nuxt.config.ts` - Updated default base URL
2. ✅ `telegram-miniapp/utils/constants.ts` - Updated BASE_URL constant
3. ✅ `telegram-miniapp/composables/useApi.ts` - Fixed URL construction (removed `/rest/` prefix from paths)

---

## 📍 Complete Endpoint List (18 Backend + 3 Payment Gateways)

### Authentication (2)
```
POST https://port.tys.uz/rest/v2/oauth/token
GET  https://port.tys.uz/rest/v2/userInfo
```

### OsgoService (7)
```
GET  https://port.tys.uz/rest/v2/services/OsgoService/getOsgoDataVersion
GET  https://port.tys.uz/rest/v2/services/OsgoService/getOsgoData
POST https://port.tys.uz/rest/v2/services/OsgoService/getVehicle
POST https://port.tys.uz/rest/v2/services/OsgoService/getDriver
POST https://port.tys.uz/rest/v2/services/OsgoService/createOsgoApplication
POST https://port.tys.uz/rest/v2/services/OsgoService/updateOsgoApplication
POST https://port.tys.uz/rest/v2/services/OsgoService/getFundPolicy
```

### PartyService (1)
```
POST https://port.tys.uz/rest/v2/services/PartyService/getIndividualByPassport
```

### BillingService (3)
```
POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsPayme
POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsClick
POST https://port.tys.uz/rest/v2/services/BillingService/sendSmsUzum
```

### Entity Operations (4)
```
GET  https://port.tys.uz/rest/v2/entities/{entityName}/{id}?view={viewName}
POST https://port.tys.uz/rest/v2/entities/{entity}
POST https://port.tys.uz/rest/v2/entities/{entity}/search
GET  https://port.tys.uz/rest/v2/entities/{entity}
```

### File Upload (1)
```
POST https://port.tys.uz/rest/v2/files
```

### Payment Gateways (External - 3)
```
Payme:  https://checkout.paycom.uz/
Click:  https://my.click.uz/services/pay/
Uzum:   https://www.apelsin.uz/open-service
```

---

## 🔐 Authentication

### Basic Auth Credentials (for OAuth)
```
Username: insurance-sMWk5btg
Password: ae9cd07c2f768108368968ab9c130651722750fcf301a4f91d2ac1341e63882c
```

### Bearer Token (for all other requests)
```
Authorization: Bearer {access_token}
```

---

## 💳 Payment Gateway Details

### Payme
- **Merchant ID:** `5c639cf2e6a51ca8439a4b47`
- **URL Format:** `https://checkout.paycom.uz/{base64(m=merchant;ac.contract_id=id;a=amount;c=callback)}`

### Click
- **Service ID:** `21087`
- **Merchant ID:** `15199`
- **URL Format:** `https://my.click.uz/services/pay/?service_id=21087&merchant_id=15199&transaction_param={policy_id}&amount={sum}`

### Uzum (via Apelsin)
- **Service ID:** `498600611`
- **URL Format:** `https://www.apelsin.uz/open-service?serviceId=498600611&userId={policy_id}&amount={amount_tiyin}`

---

## 🔄 Correct API Flow

1. **Login** → `POST /oauth/token` → Get Bearer token
2. **Get Metadata** → `GET /services/OsgoService/getOsgoData` → Cache locally
3. **Verify Vehicle** → `POST /services/OsgoService/getVehicle`
4. **Verify Owner** → `POST /services/PartyService/getIndividualByPassport`
5. **Verify Drivers** → `POST /services/OsgoService/getDriver` (for each)
6. **Create Policy** → `POST /services/OsgoService/createOsgoApplication` → Get policy ID
7. **Payment** → Redirect to gateway OR Send SMS link
8. **Get Policy Number** → `POST /services/OsgoService/getFundPolicy` → Get serial & number

---

## 📝 Environment Variables

### Required for Miniapp

```env
# Backend API (Production)
NUXT_PUBLIC_API_BASE=https://port.tys.uz/rest/v2/

# Payment Gateways
VITE_PAYME_CHECKOUT=https://checkout.paycom.uz/
VITE_PAYME_MERCHANT=5c639cf2e6a51ca8439a4b47

VITE_CLICK_CHECKOUT=https://my.click.uz/services/pay/
VITE_CLICK_SERVICE=21087
VITE_CLICK_MERCHANT=15199

VITE_UZUM_CHECKOUT=https://www.apelsin.uz/open-service
VITE_UZUM_SERVICE_ID=498600611

# Additional Services
VITE_ID_BASE_URL=https://id.tys.uz/
VITE_INFO_BASE_URL=https://apip.tys.uz/
```

### For Development (Optional)
```env
NUXT_PUBLIC_API_BASE=https://dev2.tys.uz/rest/v2/
```

---

## 📊 Entity & View Names

| Entity Type | Entity Name | View Name |
|-------------|-------------|-----------|
| OSGO Policy | `contract$Osgo` | `osgo-front-view` |
| Individual | `base$Individual` | `individual-front-view` |
| Vehicle | `osgo_Vehicle` | - |
| Driver | `osgoDriver` | - |

---

## ✅ Verification Checklist

- [x] Production base URL verified: `https://port.tys.uz/rest/v2/`
- [x] Development base URL verified: `https://dev2.tys.uz/rest/v2/`
- [x] Miniapp nuxt.config.ts updated with correct URL
- [x] Constants file updated with correct URL
- [x] URL construction fixed (no duplicate /rest/)
- [x] All 18 backend endpoints documented
- [x] All 3 payment gateways documented
- [x] Authentication credentials extracted
- [x] Payment gateway details extracted
- [x] Website and miniapp endpoints match ✅

---

## 📈 Summary Statistics

| Category | Count |
|----------|-------|
| **Authentication Endpoints** | 2 |
| **OsgoService Endpoints** | 7 |
| **PartyService Endpoints** | 1 |
| **BillingService Endpoints** | 3 |
| **Entity Operations** | 4 |
| **File Operations** | 1 |
| **Backend Total** | **18** |
| **Payment Gateways** | 3 |
| **Grand Total** | **21** |

---

## 🎯 Key Points

1. ✅ Base URL is `https://port.tys.uz/rest/v2/` (NOT `https://api.ecclivo.uz`)
2. ✅ API version is v2 (included in base URL path)
3. ✅ All service calls use: `{baseURL}services/{ServiceName}/{methodName}`
4. ✅ All entity calls use: `{baseURL}entities/{entityName}/{id}`
5. ✅ OAuth endpoint: `{baseURL}oauth/token`
6. ✅ Bearer token required for all authenticated requests
7. ✅ Uzum payment uses Apelsin service (different domain)

---

## 🚀 Ready to Use

All configurations have been updated and are ready for production:

```typescript
// ✅ Correct Configuration
const apiBaseUrl = "https://port.tys.uz/rest/v2/"

// ✅ Correct URL Construction
const serviceUrl = `${apiBaseUrl}services/OsgoService/getOsgoData`
// Result: https://port.tys.uz/rest/v2/services/OsgoService/getOsgoData ✅

const entityUrl = `${apiBaseUrl}entities/contract$Osgo/${id}?view=osgo-front-view`
// Result: https://port.tys.uz/rest/v2/entities/contract$Osgo/{id}?view=osgo-front-view ✅
```

---

**Status:** ✅ ALL VERIFIED AND CORRECTED
**Production Backend:** https://port.tys.uz/rest/v2/
**API Version:** v2
**Last Updated:** 2024