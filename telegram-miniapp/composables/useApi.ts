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

  // Auth header helper
  const authHeader = () => {
    const token = getToken();
    return token ? { authorization: `Bearer ${token}` } : {};
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
      params?: any;
    },
  ) => {
    try {
      const response = await $fetch(
        `${API_BASE_URL}services/${service}/${method}`,
        {
          method: options?.method || "GET",
          headers: authHeader(),
          body: options?.body,
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
        headers: authHeader(),
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
        headers: authHeader(),
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
        headers: authHeader(),
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
        headers: authHeader(),
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
        headers: authHeader(),
        body: params,
      });
    } catch (error) {
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
        headers: authHeader(),
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

      // Handle response format
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as any).data;
        if (data.error) {
          throw new Error(data.error.message || "Driver verification failed");
        }
        return data.result || data;
      }
      return response;
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
          body: params,
        },
      );

      // Handle response format
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as any).data;
        if (data.error) {
          throw new Error(data.error.message || "Failed to create application");
        }
        return data.result?.id || data.id;
      }
      return response;
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
          body: params,
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
        body: { id },
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

  return {
    invokeService,
    invokeQuery,
    fetchEntity,
    fetchEntities,
    createEntity,
    searchEntities,
    signIn,
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
