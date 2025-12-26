// API composable for Nuxt 3 - Using $fetch
export const useApi = () => {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.apiBase || "https://port.tys.uz/rest/v2/";
  
  // Get temp credentials from environment variables
  const TEMP_CREDENTIALS = {
    USERNAME: config.public.tempAuthUsername || "998935286407",
    PASSWORD: config.public.tempAuthPassword || "1642845",
  };

  // Token management
  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth-token");
  };

  const setToken = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", token);
    }
  };

  const clearToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
    }
  };
  
  // Auto-login with temp credentials if no token exists
  let authPromise: Promise<string> | null = null;
  const ensureAuth = async (): Promise<string> => {
    // Return existing token if available
    const existingToken = getToken();
    if (existingToken) {
      return existingToken;
    }
    
    // If auth is already in progress, wait for it
    if (authPromise) {
      return authPromise;
    }
    
    // Start auto-login with temp credentials
    authPromise = (async () => {
      try {
        console.log("[useApi] No token found, auto-logging in with temp credentials");
        const token = await signIn(TEMP_CREDENTIALS.USERNAME, TEMP_CREDENTIALS.PASSWORD);
        console.log("[useApi] Auto-login successful");
        authPromise = null; // Clear promise after completion
        return token;
      } catch (error) {
        console.error("[useApi] Auto-login failed:", error);
        authPromise = null; // Clear promise on error
        throw error;
      }
    })();
    
    return authPromise;
  };

  // Get current locale for language header
  const getCurrentLocale = (): string => {
    try {
      const { locale } = useI18n();
      return locale.value || 'uz';
    } catch {
      // Fallback to localStorage if i18n not available
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem('app-language');
        return (saved === 'ru' || saved === 'uz') ? saved : 'uz';
      }
      return 'uz';
    }
  };

  // Auth header helper
  const authHeader = () => {
    const token = getToken();
    return token ? { authorization: `Bearer ${token}` } : {};
  };

  // Build headers with auth and language
  const buildHeaders = (additionalHeaders?: Record<string, string>): Record<string, string> => {
    const locale = getCurrentLocale();
    const languageHeader = locale === 'ru' ? 'ru-RU' : 'uz-UZ';
    
    return {
      ...authHeader(),
      'Accept-Language': languageHeader,
      ...additionalHeaders,
    };
  };

  // Error handling
  class AjaxError {
    public creation: Date;
    public raw: any;
    public status?: number;

    constructor(err: any) {
      this.raw = err;
      this.creation = new Date();

      if (err?.response?.status) {
        this.status = err.response.status;
      } else if (err?.statusCode) {
        this.status = err.statusCode;
      }
    }

    public unauthorized(): boolean {
      return this.status === 401;
    }

    public toString(): string {
      return (
        this.raw?.data?.error?.message ??
        this.raw?.data?.message ??
        this.raw?.data?.error_description ??
        this.raw?.data?.error ??
        this.raw?.message ??
        "Unexpected error"
      );
    }
  }

  const handleError = (err: any): never => {
    throw Object.freeze(new AjaxError(err));
  };

  // Core API methods
  const invokeService = async (
    service: string,
    method: string,
    options?: {
      method?: string;
      body?: any;
      data?: any;
      params?: any;
    },
  ) => {
    try {
      // Ensure authentication before making request
      await ensureAuth();
      
      // Use body if provided, otherwise use data (for compatibility with website)
      const requestBody = options?.body || options?.data;
      
      // Build headers - ensure Content-Type is set for POST with body
      const additionalHeaders: Record<string, string> = {};
      if (requestBody && (options?.method === 'POST' || options?.method === 'PUT' || options?.method === 'PATCH')) {
        additionalHeaders['Content-Type'] = 'application/json';
      }
      const headers = buildHeaders(additionalHeaders);
      
      const response = await $fetch(
        `${API_BASE_URL}services/${service}/${method}`,
        {
          method: options?.method || "GET",
          headers,
          body: requestBody,
          params: options?.params,
        },
      );
      console.log("[useApi] invokeService response:", {
        service,
        method,
        response,
      });
      return response;
    } catch (error: any) {
      // Handle 401 errors by re-authenticating and retrying once
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        console.log("[useApi] 401 error, clearing token and re-authenticating");
        clearToken();
        try {
          await ensureAuth();
          // Retry the request once after re-auth
          const requestBody = options?.body || options?.data;
          const additionalHeaders: Record<string, string> = {};
          if (requestBody && (options?.method === 'POST' || options?.method === 'PUT' || options?.method === 'PATCH')) {
            additionalHeaders['Content-Type'] = 'application/json';
          }
          const headers = buildHeaders(additionalHeaders);
          const response = await $fetch(
            `${API_BASE_URL}services/${service}/${method}`,
            {
              method: options?.method || "GET",
              headers,
              body: requestBody,
              params: options?.params,
            },
          );
          return response;
        } catch (retryError) {
          console.error("[useApi] invokeService retry error:", {
            service,
            method,
            retryError,
          });
          handleError(retryError);
        }
      }
      console.error("[useApi] invokeService error:", {
        service,
        method,
        error,
      });
      handleError(error);
    }
  };

  const invokeQuery = async (
    query: string,
    method: string,
    options?: {
      method?: string;
      body?: any;
      params?: any;
    },
  ) => {
    try {
      // Ensure authentication before making request
      await ensureAuth();
      
      return await $fetch(`${API_BASE_URL}queries/${query}/${method}`, {
        method: options?.method || "GET",
        headers: buildHeaders(),
        body: options?.body,
        params: options?.params,
      });
    } catch (error: any) {
      // Handle 401 errors by re-authenticating and retrying once
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        console.log("[useApi] 401 error, clearing token and re-authenticating");
        clearToken();
        try {
          await ensureAuth();
          return await $fetch(`${API_BASE_URL}queries/${query}/${method}`, {
            method: options?.method || "GET",
            headers: buildHeaders(),
            body: options?.body,
            params: options?.params,
          });
        } catch (retryError) {
          handleError(retryError);
        }
      }
      handleError(error);
    }
  };

  const fetchEntity = async <T = any>(
    entity: string,
    id: string,
    params?: any,
  ): Promise<T> => {
    try {
      // Ensure authentication before making request
      await ensureAuth();
      
      return await $fetch<T>(`${API_BASE_URL}entities/${entity}/${id}`, {
        headers: buildHeaders(),
        params: params,
      });
    } catch (error: any) {
      // Handle 401 errors by re-authenticating and retrying once
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        console.log("[useApi] 401 error, clearing token and re-authenticating");
        clearToken();
        try {
          await ensureAuth();
          return await $fetch<T>(`${API_BASE_URL}entities/${entity}/${id}`, {
            headers: buildHeaders(),
            params: params,
          });
        } catch (retryError) {
          handleError(retryError);
        }
      }
      handleError(error);
    }
  };

  const fetchEntities = async <T = any>(
    entity: string,
    params?: any,
  ): Promise<T[]> => {
    try {
      // Ensure authentication before making request
      await ensureAuth();
      
      return await $fetch<T[]>(`${API_BASE_URL}entities/${entity}`, {
        headers: buildHeaders(),
        params: params,
      });
    } catch (error: any) {
      // Handle 401 errors by re-authenticating and retrying once
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        console.log("[useApi] 401 error, clearing token and re-authenticating");
        clearToken();
        try {
          await ensureAuth();
          return await $fetch<T[]>(`${API_BASE_URL}entities/${entity}`, {
            headers: buildHeaders(),
            params: params,
          });
        } catch (retryError) {
          handleError(retryError);
        }
      }
      handleError(error);
    }
  };

  const createEntity = async <T = any>(
    entity: string,
    payload?: any,
  ): Promise<T> => {
    try {
      // Ensure authentication before making request
      await ensureAuth();
      
      return await $fetch<T>(`${API_BASE_URL}entities/${entity}`, {
        method: "POST",
        headers: buildHeaders({ 'Content-Type': 'application/json' }),
        body: payload,
      });
    } catch (error: any) {
      // Handle 401 errors by re-authenticating and retrying once
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        console.log("[useApi] 401 error, clearing token and re-authenticating");
        clearToken();
        try {
          await ensureAuth();
          return await $fetch<T>(`${API_BASE_URL}entities/${entity}`, {
            method: "POST",
            headers: buildHeaders({ 'Content-Type': 'application/json' }),
            body: payload,
          });
        } catch (retryError) {
          handleError(retryError);
        }
      }
      handleError(error);
    }
  };

  const searchEntities = async <T = any>(
    entity: string,
    params?: any,
  ): Promise<T[]> => {
    try {
      // Ensure authentication before making request
      await ensureAuth();
      
      return await $fetch<T[]>(`${API_BASE_URL}entities/${entity}/search`, {
        method: "POST",
        headers: buildHeaders({ 'Content-Type': 'application/json' }),
        body: params,
      });
    } catch (error: any) {
      // Handle 401 errors by re-authenticating and retrying once
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        console.log("[useApi] 401 error, clearing token and re-authenticating");
        clearToken();
        try {
          await ensureAuth();
          return await $fetch<T[]>(`${API_BASE_URL}entities/${entity}/search`, {
            method: "POST",
            headers: buildHeaders({ 'Content-Type': 'application/json' }),
            body: params,
          });
        } catch (retryError) {
          handleError(retryError);
        }
      }
      handleError(error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      // Ensure authentication before making request
      await ensureAuth();
      
      const response = await $fetch(`${API_BASE_URL}userInfo/`, {
        headers: buildHeaders(),
      });
      return response;
    } catch (error: any) {
      // Handle 401 errors by re-authenticating and retrying once
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        console.log("[useApi] 401 error, clearing token and re-authenticating");
        clearToken();
        try {
          await ensureAuth();
          return await $fetch(`${API_BASE_URL}userInfo/`, {
            headers: buildHeaders(),
          });
        } catch (retryError) {
          console.error("[useApi] fetchUserInfo retry error:", retryError);
          handleError(retryError);
        }
      }
      console.error("[useApi] fetchUserInfo error:", error);
      handleError(error);
    }
  };

  const signIn = async (
    username: string,
    password: string,
  ): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("grant_type", "password");
      formData.append("username", username);
      formData.append("password", password);

      const response = await $fetch<{ access_token: string }>(
        `${API_BASE_URL}oauth/token/`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Basic ${btoa("insurance-sMWk5btg:ae9cd07c2f768108368968ab9c130651722750fcf301a4f91d2ac1341e63882c")}`,
          },
        },
      );

      const token = response.access_token;
      setToken(token);
      return token;
    } catch (error) {
      handleError(error);
    }
  };

  const uploadFile = async (file: File): Promise<any> => {
    try {
      // Ensure authentication before making request
      await ensureAuth();
      
      const formData = new FormData();
      formData.append("file", file);

      return await $fetch(`${API_BASE_URL}files`, {
        method: "POST",
        headers: buildHeaders(),
        body: formData,
      });
    } catch (error: any) {
      // Handle 401 errors by re-authenticating and retrying once
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        console.log("[useApi] 401 error, clearing token and re-authenticating");
        clearToken();
        try {
          await ensureAuth();
          const formData = new FormData();
          formData.append("file", file);
          return await $fetch(`${API_BASE_URL}files`, {
            method: "POST",
            headers: buildHeaders(),
            body: formData,
          });
        } catch (retryError) {
          handleError(retryError);
        }
      }
      handleError(error);
    }
  };

  // Specific API methods for OSGO operations
  const getVehicle = async (params: {
    govNumber: string;
    techPassportSeries: string;
    techPassportNumber: string;
  }) => {
    try {
      const response = await invokeService("OsgoService", "getVehicle", {
        method: "POST",
        body: {
          vehicleType: {
            govNumber: params.govNumber,
            techPassportSeria: params.techPassportSeries,
            techPassportNumber: params.techPassportNumber,
          },
        },
      });

      // Handle response format
      if (response && typeof response === "object") {
        // If response has 'data' property, extract it
        const data = (response as any).data || response;
        
        // If data has 'error' property, throw error
        if (data.error) {
          throw new Error(data.error.message || "Vehicle verification failed");
        }
        
        // Return result if nested, otherwise return the whole data object
        // The result might be at data.result or directly in the response
        if (data.result) {
          return { result: data.result, error: data.error };
        }
        
        // If response itself has result/error structure, return it
        if ((response as any).result || (response as any).error) {
          return response;
        }
        
        return data;
      }
      return response;
    } catch (error) {
      console.error("[useApi] getVehicle error:", error);
      throw error;
    }
  };

  const getIndividualByPassport = async (params: {
    passportSeries: string;
    passportNumber: string;
    birthDate: string;
  }) => {
    try {
      const response = await invokeService(
        "PartyService",
        "getIndividualByPassport",
        {
          method: "POST",
          body: {
            passport: {
              passportSeries: params.passportSeries,
              passportNumber: params.passportNumber,
              birthDate: params.birthDate,
              isConsent: "Y",
            },
          },
        },
      );

      // Handle response format - API returns { result: {...} } or { data: { result: {...} } }
      if (response && typeof response === "object") {
        // Check if response has nested data structure
        if ("data" in response) {
          const data = (response as any).data;
          if (data.error) {
            throw new Error(
              data.error.message || "Individual verification failed",
            );
          }
          return data.result || data;
        }
        // Check if response has result directly
        if ("result" in response) {
          const result = (response as any).result;
          if (result && typeof result === "object" && "error" in result) {
            throw new Error(
              result.error?.message || "Individual verification failed",
            );
          }
          return result;
        }
      }
      return response;
    } catch (error) {
      console.error("[useApi] getIndividualByPassport error:", error);
      throw error;
    }
  };

  const getDriver = async (params: {
    passportSeries: string;
    passportNumber: string;
    birthDate: string;
  }) => {
    try {
      const response = await invokeService("OsgoService", "getDriver", {
        method: "POST",
        body: {
          passportBirthDateType: {
            passportSeries: params.passportSeries,
            passportNumber: params.passportNumber,
            birthDate: params.birthDate,
            isConsent: "Y",
          },
        },
      });

      // Handle response format - match website implementation
      // Website expects: { data: { error?: any; result?: Driver } }
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as any).data;
        
        // Check for error first
        if (data.error) {
          throw new Error(data.error.message || "Driver verification failed");
        }
        
        // Check if result is empty (website checks with _.isEmpty)
        if (!data.result || (typeof data.result === "object" && Object.keys(data.result).length === 0)) {
          throw new Error("Driver not found");
        }
        
        // Return the result
        return data.result;
      }
      
      // If response doesn't have data wrapper, check for direct result/error
      if (response && typeof response === "object") {
        if ("error" in response) {
          throw new Error((response as any).error?.message || "Driver verification failed");
      }
        if ("result" in response) {
          const result = (response as any).result;
          if (!result || (typeof result === "object" && Object.keys(result).length === 0)) {
            throw new Error("Driver not found");
          }
          return result;
        }
      }
      
      // If response is the driver object directly
      if (response && typeof response === "object" && "id" in response) {
      return response;
      }
      
      throw new Error("Invalid response format from driver verification");
    } catch (error) {
      console.error("[useApi] getDriver error:", error);
      throw error;
    }
  };

  const createOsgoApplication = async (params: any) => {
    try {
      const response = await invokeService(
        "OsgoService",
        "createOsgoApplication",
        {
          method: "POST",
          data: params,
        },
      );

      // Handle response format matching website implementation
      // Website expects: { data: { error?: AjaxError; result: { id: string } } }
      // $fetch returns the response.data directly, so we get: { error?: any; result: { id: string } }

      if (response && typeof response === "object") {
        // Check if response has nested data structure (axios-style response)
        if ("data" in response) {
          const data = (response as any).data;
          
          // Check for error first (website pattern)
          if (data.error) {
            const errorMsg = data.error.message || data.error.messageUz || "Failed to create application";
            throw new Error(errorMsg);
          }
          
          // Check if result has error nested inside
          if (data.result && typeof data.result === "object") {
            // Check if result itself is an error object (has error property)
            if ("error" in data.result) {
              const errorMsg = data.result.error?.message || data.result.error?.messageUz || "Failed to create application";
              throw new Error(errorMsg);
          }
            
            // Check if result itself looks like an error object (has code/message but no id)
            if (("code" in data.result || "message" in data.result) && !("id" in data.result)) {
              const errorMsg = data.result.message || data.result.messageUz || "Failed to create application";
              throw new Error(errorMsg);
        }
            
            // Extract ID from result
            if (data.result.id && typeof data.result.id === "string") {
              return data.result.id;
            }
          }
          
          // Fallback: check if data has id directly
          if (data.id && typeof data.id === "string") {
            return data.id;
          }
        }
        
        // Check if response has error directly (unwrapped response)
        if ("error" in response) {
          const errorMsg = (response as any).error?.message || (response as any).error?.messageUz || "Failed to create application";
          throw new Error(errorMsg);
        }
        
        // Check if response has result directly
        if ("result" in response) {
          const result = (response as any).result;
          
          // If result is an error object, throw it
          if (result && typeof result === "object") {
            // Check if result has nested error
            if ("error" in result) {
              const errorMsg = result.error?.message || result.error?.messageUz || "Failed to create application";
              throw new Error(errorMsg);
            }
            
            // Check if result itself looks like an error object (has code/message but no id)
            if (("code" in result || "message" in result) && !("id" in result)) {
              const errorMsg = result.message || result.messageUz || "Failed to create application";
              throw new Error(errorMsg);
            }
            
            // Extract ID from result
            if (result.id && typeof result.id === "string") {
            return result.id;
            }
          }
          
          // If result is a string (the ID), return it
          if (typeof result === "string") {
          return result;
          }
        }
      }
      
      // If response is a string, it's likely the ID directly
      if (typeof response === "string") {
      return response;
      }
      
      // Final safety check: if response looks like an error object, throw it
      if (response && typeof response === "object") {
        if (("code" in response || "message" in response) && !("id" in response)) {
          const errorMsg = (response as any).message || (response as any).messageUz || "Failed to create application";
          throw new Error(errorMsg);
        }
      }
      
      // If we can't extract an ID, throw an error
      console.error("[useApi] createOsgoApplication: Invalid response format", response);
      throw new Error("Invalid response format: could not extract contract ID");
    } catch (error) {
      console.error("[useApi] createOsgoApplication error:", error);
      throw error;
    }
  };

  const updateOsgoApplication = async (params: any) => {
    try {
      const response = await invokeService(
        "OsgoService",
        "updateOsgoApplication",
        {
          method: "POST",
          data: params,
        },
      );

      // Handle response format
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as any).data;
        if (data.error) {
          throw new Error(data.error.message || "Failed to update application");
        }
        return data.result;
      }
      return response;
    } catch (error) {
      console.error("[useApi] updateOsgoApplication error:", error);
      throw error;
    }
  };

  const getFundPolicy = async (id: string) => {
    try {
      const response = await invokeService("OsgoService", "getFundPolicy", {
        method: "POST",
        data: { id },
      });

      // Handle response format
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as any).data;
        if (data.error) {
          throw new Error(data.error.message || "Failed to get fund policy");
        }
        return data.result;
      }
      return response;
    } catch (error) {
      console.error("[useApi] getFundPolicy error:", error);
      throw error;
    }
  };

  const sendPaymentLink = async (
    method: "sendSmsPayme" | "sendSmsClick" | "sendSmsUzum",
    contractId: string,
    phone: string,
    amount: number
  ) => {
    try {
      // Validate contractId is a string (not an error object)
      if (!contractId || typeof contractId !== "string") {
        throw new Error("Invalid contract ID: contract must be created first");
      }

      const response = await invokeService("BillingService", method, {
        method: "POST",
        body: {
          object: {
            phone: phone.replace(/[+()-]/g, ""),
            contractId: contractId,
            amount: amount,
          },
        },
      });

      // Handle response format matching website implementation
      // Website expects: { data: { error?: any } }
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as any).data;
        if (data.error) {
          const errorMsg = data.error.message || data.error.messageUz || "Failed to send payment link";
          throw new Error(errorMsg);
        }
        return data.result || data;
      }
      
      // Check if response has error directly
      if (response && typeof response === "object" && "error" in response) {
        const errorMsg = (response as any).error?.message || (response as any).error?.messageUz || "Failed to send payment link";
        throw new Error(errorMsg);
      }
      
      return response;
    } catch (error) {
      console.error("[useApi] sendPaymentLink error:", error);
      throw error;
    }
  };

  /**
   * Get Kasko vehicle ID from EAutoService
   * Used to get vehicle ID for Kasko contract creation
   */
  const getKaskoVehicle = async (params: {
    govNumber: string;
    techPassportSeries: string;
    techPassportNumber: string;
  }) => {
    try {
      const response = await invokeService("EAutoService", "getVehicle", {
        method: "POST",
        body: {
          vehicleType: {
            govNumber: params.govNumber.toUpperCase(),
            techPassportNumber: params.techPassportNumber,
            techPassportSeria: params.techPassportSeries,
          },
        },
      });

      console.log("[useApi] getKaskoVehicle raw response:", response);

      // Parse response if it's a string
      let parsedResponse: any = response;
      if (typeof response === "string") {
        try {
          parsedResponse = JSON.parse(response);
        } catch (parseError) {
          console.error("[useApi] Failed to parse getKaskoVehicle response:", parseError);
          throw new Error("Invalid JSON response from getKaskoVehicle");
        }
      }

      // Handle different response formats
      // Format 1: response.data.result === "0" (axios-like wrapper)
      if (parsedResponse && typeof parsedResponse === "object" && "data" in parsedResponse) {
        const data = parsedResponse.data;
        if (data && typeof data === "object") {
          if (data.result === "0") {
            return { success: true, id: data.id, data: data };
          } else if (data.result !== undefined) {
            const errorMsg = data.message || "Failed to get Kasko vehicle";
            throw new Error(errorMsg);
          }
        }
      }

      // Format 2: response.result === "0" (direct response)
      if (parsedResponse && typeof parsedResponse === "object" && "result" in parsedResponse) {
        if (parsedResponse.result === "0") {
          return { success: true, id: parsedResponse.id, data: parsedResponse };
        } else {
          const errorMsg = parsedResponse.message || "Failed to get Kasko vehicle";
          throw new Error(errorMsg);
        }
      }

      // Format 3: response is the data directly (if $fetch unwraps it)
      if (parsedResponse && typeof parsedResponse === "object" && "id" in parsedResponse) {
        // If it has an id, assume it's successful (some APIs don't return result field on success)
        return { success: true, id: parsedResponse.id, data: parsedResponse };
      }

      console.error("[useApi] getKaskoVehicle unexpected response format:", JSON.stringify(parsedResponse, null, 2));
      throw new Error("Invalid response format from getKaskoVehicle");
    } catch (error) {
      console.error("[useApi] getKaskoVehicle error:", error);
      throw error;
    }
  };

  /**
   * Get Kasko individual ID from EAutoService
   * Used to get individual ID for Kasko contract creation
   */
  const getKaskoIndividual = async (params: {
    passportSeries: string;
    passportNumber: string;
    birthDate: string; // Format: DD-MM-YYYY
  }) => {
    try {
      const response = await invokeService("EAutoService", "getIndividual", {
        method: "POST",
        body: {
          passport: {
            birthDate: params.birthDate,
            passportSeries: params.passportSeries.toUpperCase(),
            passportNumber: params.passportNumber,
            isConsent: "Y",
          },
        },
      });

      console.log("[useApi] getKaskoIndividual raw response:", response);

      // Parse response if it's a string
      let parsedResponse: any = response;
      if (typeof response === "string") {
        try {
          parsedResponse = JSON.parse(response);
        } catch (parseError) {
          console.error("[useApi] Failed to parse getKaskoIndividual response:", parseError);
          throw new Error("Invalid JSON response from getKaskoIndividual");
        }
      }

      // Handle different response formats
      // Format 1: response.data.result === "0" (axios-like wrapper)
      if (parsedResponse && typeof parsedResponse === "object" && "data" in parsedResponse) {
        const data = parsedResponse.data;
        if (data && typeof data === "object") {
          if (data.result === "0") {
            return { success: true, id: data.id, data: data };
          } else if (data.result !== undefined) {
            const errorMsg = data.message || "Failed to get Kasko individual";
            throw new Error(errorMsg);
          }
        }
      }

      // Format 2: response.result === "0" (direct response)
      if (parsedResponse && typeof parsedResponse === "object" && "result" in parsedResponse) {
        if (parsedResponse.result === "0") {
          return { success: true, id: parsedResponse.id, data: parsedResponse };
        } else {
          const errorMsg = parsedResponse.message || "Failed to get Kasko individual";
          throw new Error(errorMsg);
        }
      }

      // Format 3: response is the data directly (if $fetch unwraps it)
      if (parsedResponse && typeof parsedResponse === "object" && "id" in parsedResponse) {
        // If it has an id, assume it's successful (some APIs don't return result field on success)
        return { success: true, id: parsedResponse.id, data: parsedResponse };
      }

      console.error("[useApi] getKaskoIndividual unexpected response format:", JSON.stringify(parsedResponse, null, 2));
      throw new Error("Invalid response format from getKaskoIndividual");
    } catch (error) {
      console.error("[useApi] getKaskoIndividual error:", error);
      throw error;
    }
  };

  /**
   * Get Kasko manufacturers list
   * Used to get manufacturer IDs for vehicle model selection
   */
  const getKaskoManufacturers = async () => {
    try {
      const response = await invokeService("EAutoService", "getManufacturer", {
        method: "GET",
      });

      console.log("[useApi] getKaskoManufacturers raw response:", response);

      // Parse response if it's a string
      let parsedResponse: any = response;
      if (typeof response === "string") {
        try {
          parsedResponse = JSON.parse(response);
        } catch (parseError) {
          console.error("[useApi] Failed to parse getKaskoManufacturers response:", parseError);
          throw new Error("Invalid JSON response from getKaskoManufacturers");
        }
      }

      // Handle array response (list of manufacturers)
      if (Array.isArray(parsedResponse)) {
        if (parsedResponse.length > 0) {
          return { success: true, manufacturers: parsedResponse, firstId: parsedResponse[0].id };
        } else {
          throw new Error("No manufacturers available");
        }
      }

      // Handle wrapped response
      if (parsedResponse && typeof parsedResponse === "object" && "data" in parsedResponse) {
        const data = parsedResponse.data;
        if (Array.isArray(data) && data.length > 0) {
          return { success: true, manufacturers: data, firstId: data[0].id };
        }
      }

      console.error("[useApi] getKaskoManufacturers unexpected response format:", JSON.stringify(parsedResponse, null, 2));
      throw new Error("Invalid response format from getKaskoManufacturers");
    } catch (error) {
      console.error("[useApi] getKaskoManufacturers error:", error);
      throw error;
    }
  };

  /**
   * Get Kasko models list for a manufacturer
   * Used to get model IDs for vehicle selection
   */
  const getKaskoModels = async (manufacturerId: string) => {
    try {
      const response = await invokeService("EAutoService", "getModel", {
        method: "POST",
        body: {
          manufacturer: manufacturerId,
        },
      });

      console.log("[useApi] getKaskoModels raw response:", response);

      // Parse response if it's a string
      let parsedResponse: any = response;
      if (typeof response === "string") {
        try {
          parsedResponse = JSON.parse(response);
        } catch (parseError) {
          console.error("[useApi] Failed to parse getKaskoModels response:", parseError);
          throw new Error("Invalid JSON response from getKaskoModels");
        }
      }

      // Handle array response (list of models)
      if (Array.isArray(parsedResponse)) {
        if (parsedResponse.length > 0) {
          return { success: true, models: parsedResponse, firstId: parsedResponse[0].id };
        } else {
          throw new Error("No models available for this manufacturer");
        }
      }

      // Handle wrapped response
      if (parsedResponse && typeof parsedResponse === "object" && "data" in parsedResponse) {
        const data = parsedResponse.data;
        if (Array.isArray(data) && data.length > 0) {
          return { success: true, models: data, firstId: data[0].id };
        }
      }

      console.error("[useApi] getKaskoModels unexpected response format:", JSON.stringify(parsedResponse, null, 2));
      throw new Error("Invalid response format from getKaskoModels");
    } catch (error) {
      console.error("[useApi] getKaskoModels error:", error);
      throw error;
    }
  };

  /**
   * Get Kasko vehicle (second call with id and model)
   * This is the final vehicle ID needed for contract creation
   */
  const getKaskoVehicle2 = async (vehicleId: string, modelId: string) => {
    try {
      const response = await invokeService("EAutoService", "getVehicle", {
        method: "POST",
        body: {
          id: vehicleId,
          model: modelId,
        },
      });

      console.log("[useApi] getKaskoVehicle2 raw response:", response);

      // Parse response if it's a string
      let parsedResponse: any = response;
      if (typeof response === "string") {
        try {
          parsedResponse = JSON.parse(response);
        } catch (parseError) {
          console.error("[useApi] Failed to parse getKaskoVehicle2 response:", parseError);
          throw new Error("Invalid JSON response from getKaskoVehicle2");
        }
      }

      // Handle different response formats
      // Format 1: response.data.result === "0" (axios-like wrapper)
      if (parsedResponse && typeof parsedResponse === "object" && "data" in parsedResponse) {
        const data = parsedResponse.data;
        if (data && typeof data === "object") {
          if (data.result === "0") {
            return { success: true, id: data.id, data: data };
          } else if (data.result !== undefined) {
            const errorMsg = data.message || "Failed to get Kasko vehicle (step 2)";
            throw new Error(errorMsg);
          }
        }
      }

      // Format 2: response.result === "0" (direct response)
      if (parsedResponse && typeof parsedResponse === "object" && "result" in parsedResponse) {
        if (parsedResponse.result === "0") {
          return { success: true, id: parsedResponse.id, data: parsedResponse };
        } else {
          const errorMsg = parsedResponse.message || "Failed to get Kasko vehicle (step 2)";
          throw new Error(errorMsg);
        }
      }

      // Format 3: response is the data directly (if $fetch unwraps it)
      if (parsedResponse && typeof parsedResponse === "object" && "id" in parsedResponse) {
        // If it has an id, assume it's successful (some APIs don't return result field on success)
        return { success: true, id: parsedResponse.id, data: parsedResponse };
      }

      console.error("[useApi] getKaskoVehicle2 unexpected response format:", JSON.stringify(parsedResponse, null, 2));
      throw new Error("Invalid response format from getKaskoVehicle2");
    } catch (error) {
      console.error("[useApi] getKaskoVehicle2 error:", error);
      throw error;
    }
  };

  /**
   * Create Kasko contract as a gift bonus
   * Uses OSGO form data to create a Kasko contract
   */
  const createKaskoContract = async (
    vehicleId: string,
    individualId: string,
    phone: string,
    payment: "PAYME" | "CLICK" | "UZUM" | "UPAY" = "PAYME"
  ) => {
    try {
      // Ensure phone is in correct format (998...)
      const formattedPhone = phone.replace(/[+()-]/g, "").replace(/^998/, "998");
      if (!formattedPhone.startsWith("998")) {
        throw new Error("Phone number must start with 998");
      }

      // Log request payload for debugging
      const requestPayload = {
        request: {
          vehicleId: vehicleId,
          individualId: individualId,
          phone: formattedPhone,
          payment: payment,
        },
      };
      console.log("[useApi] createKaskoContract request payload:", JSON.stringify(requestPayload, null, 2));

      // Make request WITHOUT authentication headers (matching reference implementation)
      // Reference uses: delete axios.defaults.params['token'] before request
      // This suggests Kasko endpoints don't require auth or use different auth method
      const locale = getCurrentLocale();
      const languageHeader = locale === 'ru' ? 'ru-RU' : 'uz-UZ';
      
      const response = await $fetch(
        `${API_BASE_URL}services/EAutoService/createContract`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': languageHeader,
            // Explicitly NOT including authorization header (matching reference behavior)
          },
          body: requestPayload,
        }
      );

      // Log raw response for debugging
      console.log("[useApi] createKaskoContract raw response:", {
        type: typeof response,
        response: response,
        stringified: typeof response === "string" ? response : JSON.stringify(response, null, 2),
      });

      // Parse response if it's a string (like other Kasko methods)
      let parsedResponse: any = response;
      if (typeof response === "string") {
        try {
          parsedResponse = JSON.parse(response);
        } catch (parseError) {
          console.error("[useApi] Failed to parse createKaskoContract response:", parseError);
          throw new Error("Invalid JSON response from createKaskoContract");
        }
      }
      
      // Log parsed response for debugging
      console.log("[useApi] createKaskoContract parsed response:", JSON.stringify(parsedResponse, null, 2));
      
      // Handle response format matching KackoForm.vue pattern
      // Success: response.data.result === "0"
      // Error: response.data.result !== "0" with response.data.message
      if (parsedResponse && typeof parsedResponse === "object" && "data" in parsedResponse) {
        const data = parsedResponse.data;
        console.log("[useApi] createKaskoContract response.data:", JSON.stringify(data, null, 2));
        if (data && typeof data === "object" && data.result === "0") {
          return { success: true, message: data.message || "Kasko contract created successfully" };
        } else if (data && typeof data === "object" && data.result !== undefined) {
          // Log the error result code for debugging
          console.error("[useApi] createKaskoContract failed with result:", data.result, "message:", data.message);
          const errorMsg = data.message || `Failed to create Kasko contract (result: ${data.result})`;
          throw new Error(errorMsg);
        }
      }

      // Check if response has result directly
      if (parsedResponse && typeof parsedResponse === "object" && "result" in parsedResponse) {
        console.log("[useApi] createKaskoContract response.result:", parsedResponse.result, "message:", parsedResponse.message);
        if (parsedResponse.result === "0") {
          return { success: true, message: parsedResponse.message || "Kasko contract created successfully" };
        } else {
          // Log the error result code for debugging
          console.error("[useApi] createKaskoContract failed with result:", parsedResponse.result, "message:", parsedResponse.message);
          const errorMsg = parsedResponse.message || `Failed to create Kasko contract (result: ${parsedResponse.result})`;
          throw new Error(errorMsg);
        }
      }

      // If we get here, the response format is unexpected
      console.error("[useApi] createKaskoContract unexpected response format:", JSON.stringify(parsedResponse, null, 2));
      throw new Error("Invalid response format from createKaskoContract");
    } catch (error) {
      console.error("[useApi] createKaskoContract error:", error);
      throw error;
    }
  };

  /**
   * Create user (sign up)
   */
  const createUser = async (login: string, password: string) => {
    try {
      const response = await invokeService("UserService", "createUser", {
        method: "POST",
        data: { login, password },
      });

      // Handle response format
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as any).data;
        if (data.error) {
          throw new Error(data.error.message || "Failed to create user");
        }
        if (!data.result) {
          throw new Error("Failed to create user");
        }
        return data.result || data;
      }
      return response;
    } catch (error) {
      console.error("[useApi] createUser error:", error);
      throw error;
    }
  };

  /**
   * Activate user with SMS code
   */
  const activateUser = async (login: string, smsCode: string) => {
    try {
      const response = await invokeService("UserService", "activateUser", {
        method: "POST",
        data: { login, smsCode },
      });

      // Handle response format
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as any).data;
        if (data.error) {
          throw new Error(data.error.message || "Неверный проверочный код");
        }
        if (!data.result) {
          throw new Error("Неверный проверочный код");
        }
        return data.result || data;
      }
      return response;
    } catch (error) {
      console.error("[useApi] activateUser error:", error);
      throw error;
    }
  };

  /**
   * Send recovery code (for activation or password recovery)
   */
  const recoveryCode = async (login: string) => {
    try {
      const response = await invokeService("UserService", "recoveryCode", {
        method: "POST",
        data: { login },
      });

      // Handle response format
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as any).data;
        if (data.error) {
          throw new Error(data.error.message || "Failed to send recovery code");
        }
        if (!data.result) {
          throw new Error("Failed to send recovery code");
        }
        return data.result || data;
      }
      return response;
    } catch (error) {
      console.error("[useApi] recoveryCode error:", error);
      throw error;
    }
  };

  /**
   * Save recovery password (reset password with SMS code)
   */
  const saveRecoveryPassword = async (
    login: string,
    password: string,
    smsCode: string
  ) => {
    try {
      const response = await invokeService(
        "UserService",
        "saveRecoveryPassword",
        {
          method: "POST",
          data: { login, password, smsCode },
        }
      );

      // Handle response format
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as any).data;
        if (data.error) {
          throw new Error(
            data.error.message || "Failed to recover password"
          );
        }
        if (!data.result) {
          throw new Error("Failed to recover password");
        }
        return data.result || data;
      }
      return response;
    } catch (error) {
      console.error("[useApi] saveRecoveryPassword error:", error);
      throw error;
    }
  };

  return {
    invokeService,
    invokeQuery,
    fetchEntity,
    fetchEntities,
    createEntity,
    sendPaymentLink,
    createKaskoContract,
    getKaskoVehicle,
    getKaskoVehicle2,
    getKaskoIndividual,
    getKaskoManufacturers,
    getKaskoModels,
    searchEntities,
    signIn,
    createUser,
    activateUser,
    recoveryCode,
    saveRecoveryPassword,
    fetchUserInfo,
    uploadFile,
    getToken,
    setToken,
    clearToken,
    ensureAuth,
    AjaxError,
    // OSGO specific methods
    getVehicle,
    getIndividualByPassport,
    getDriver,
    createOsgoApplication,
    updateOsgoApplication,
    getFundPolicy,
  };
};
