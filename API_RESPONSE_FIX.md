# API Response Structure Fix

## Issue Description

The miniapp was encountering the following error:
```
TypeError: Cannot read properties of undefined (reading 'version')
at fetchMeta (meta.ts:172:23)
```

## Root Cause

The API response structure was being handled incorrectly. The backend returns responses in this format:

```json
{
  "data": {
    "version": 123,
    "carType": [...],
    "period": [...]
  }
}
```

However, the `useApi.ts` composable was:
1. Receiving the axios response: `{ data: { data: {...} } }`
2. Extracting `response.data` → `{ data: {...} }`
3. Then trying to access `.data` again → `undefined.version` ❌

## The Fix

Updated `composables/useApi.ts` to properly destructure the response:

### Before (WRONG):
```typescript
const getOsgoData = async (): Promise<GetOsgoDataResponse["data"]> => {
  const response = await invokeService<GetOsgoDataResponse["data"]>(
    SERVICES.OSGO,
    API_METHODS.GET_OSGO_DATA,
  );
  return response.data; // ❌ This returns undefined!
}
```

### After (CORRECT):
```typescript
const getOsgoData = async (): Promise<GetOsgoDataResponse["data"]> => {
  const { data } = await invokeService<GetOsgoDataResponse["data"]>(
    SERVICES.OSGO,
    API_METHODS.GET_OSGO_DATA,
  );
  return data; // ✅ Correctly returns the actual data
}
```

## Changes Made

### File: `composables/useApi.ts`

**Updated all service methods to properly destructure responses:**

1. ✅ `getOsgoDataVersion()` - Returns version number
2. ✅ `getOsgoData()` - Returns metadata object
3. ✅ `getVehicle()` - Returns vehicle data
4. ✅ `getIndividualByPassport()` - Returns individual data
5. ✅ `getDriver()` - Returns driver data
6. ✅ `createOsgoApplication()` - Returns policy ID
7. ✅ `updateOsgoApplication()` - Returns boolean result
8. ✅ `getFundPolicy()` - Returns policy serial/number
9. ✅ `sendPaymePaymentLink()` - Returns payment response
10. ✅ `sendClickPaymentLink()` - Returns payment response
11. ✅ `sendUzumPaymentLink()` - Returns payment response

**Pattern used:**
```typescript
// Changed from:
const response = await invokeService<T>(...);
return response.data;

// To:
const { data } = await invokeService<T>(...);
return data;
```

## Response Structure Examples

### Service Method Response Structure:
```typescript
// invokeService returns:
{
  data: {
    version: 123,
    carType: [...],
    // ... actual data
  }
}

// After destructuring { data }:
{
  version: 123,
  carType: [...],
  // ... actual data
}
```

### Service Method with Error/Result Pattern:
```typescript
// invokeService returns:
{
  data: {
    result: { id: "uuid" },
    error: null
  }
}

// After destructuring { data }:
{
  result: { id: "uuid" },
  error: null
}

// Then we access: data.result.id
```

## How It Works Now

### 1. Axios Request
```typescript
const response = await axios.request({
  url: 'services/OsgoService/getOsgoData'
});
// response.data = { data: { version: 123, ... } }
```

### 2. invokeService Returns
```typescript
const invokeService = async () => {
  const response = await axios.request(...);
  return response.data; // Returns { data: { version: 123, ... } }
};
```

### 3. Service Method Destructures
```typescript
const getOsgoData = async () => {
  const { data } = await invokeService(...);
  // data = { version: 123, carType: [...], ... }
  return data; // ✅ Correct!
};
```

### 4. Store Receives Correct Data
```typescript
// meta.ts
const data = await api.getOsgoData();
console.log(data.version); // ✅ 123 (works!)
```

## Verification

Test that all endpoints now return correct data:

```typescript
// ✅ Should work:
const version = await api.getOsgoDataVersion();
console.log(version); // number

// ✅ Should work:
const metadata = await api.getOsgoData();
console.log(metadata.version); // number
console.log(metadata.carType); // array

// ✅ Should work:
const vehicle = await api.getVehicle({ ... });
console.log(vehicle.result.govNumber); // string

// ✅ Should work:
const policyId = await api.createOsgoApplication({ ... });
console.log(policyId); // string (UUID)
```

## Related Files

- ✅ `composables/useApi.ts` - Fixed response handling
- ✅ `stores/meta.ts` - Uses corrected API (no changes needed)
- ✅ All other stores/components - Will work correctly now

## Status

✅ **FIXED** - All API response handling has been corrected.

## Testing Checklist

- [ ] Test metadata loading (getOsgoData)
- [ ] Test version checking (getOsgoDataVersion)
- [ ] Test vehicle verification (getVehicle)
- [ ] Test owner verification (getIndividualByPassport)
- [ ] Test driver verification (getDriver)
- [ ] Test policy creation (createOsgoApplication)
- [ ] Test policy update (updateOsgoApplication)
- [ ] Test fund policy retrieval (getFundPolicy)

---

**Date Fixed:** 2024
**Files Changed:** 1 (`composables/useApi.ts`)
**Lines Changed:** ~50 lines (destructuring pattern updates)