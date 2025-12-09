// API composable for Nuxt 3 - Using $fetch
export const useApi = () => {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.apiBase || "https://port.tys.uz/rest/v2/";

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
    } catch (error) {
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
      return await $fetch(`${API_BASE_URL}queries/${query}/${method}`, {
        method: options?.method || "GET",
        headers: buildHeaders(),
        body: options?.body,
        params: options?.params,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const fetchEntity = async <T = any>(
    entity: string,
    id: string,
    params?: any,
  ): Promise<T> => {
    try {
      return await $fetch<T>(`${API_BASE_URL}entities/${entity}/${id}`, {
        headers: buildHeaders(),
        params: params,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const fetchEntities = async <T = any>(
    entity: string,
    params?: any,
  ): Promise<T[]> => {
    try {
      return await $fetch<T[]>(`${API_BASE_URL}entities/${entity}`, {
        headers: buildHeaders(),
        params: params,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const createEntity = async <T = any>(
    entity: string,
    payload?: any,
  ): Promise<T> => {
    try {
      return await $fetch<T>(`${API_BASE_URL}entities/${entity}`, {
        method: "POST",
        headers: buildHeaders({ 'Content-Type': 'application/json' }),
        body: payload,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const searchEntities = async <T = any>(
    entity: string,
    params?: any,
  ): Promise<T[]> => {
    try {
      return await $fetch<T[]>(`${API_BASE_URL}entities/${entity}/search`, {
        method: "POST",
        headers: buildHeaders({ 'Content-Type': 'application/json' }),
        body: params,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await $fetch(`${API_BASE_URL}userInfo/`, {
        headers: buildHeaders(),
      });
      return response;
    } catch (error) {
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
      const formData = new FormData();
      formData.append("file", file);

      return await $fetch(`${API_BASE_URL}files`, {
        method: "POST",
        headers: buildHeaders(),
        body: formData,
      });
    } catch (error) {
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
