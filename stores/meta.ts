// Metadata Store for ECCLIVO Telegram Mini App
// Handles OSGO metadata (car types, periods, areas, etc.)

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  EcclivoMeta,
  CarType,
  Period,
  IncidentFrequency,
  DrivedArea,
  Beneficiary,
} from "~/types/osgo";
import { OsgoPeriodType } from "~/types/osgo";
import { STORAGE_KEYS } from "~/utils/constants";
import sortBy from "lodash-es/sortBy";

export const useMetaStore = defineStore("meta", () => {
  // State
  const meta = ref<EcclivoMeta | null>(null);
  const fetching = ref(false);
  const error = ref<string | null>(null);
  const lastFetchTime = ref<number | null>(null);

  // Computed
  const isLoaded = computed(() => meta.value !== null);
  const version = computed(() => meta.value?.version || 0);

  // Car Types
  const carTypes = computed(() => {
    if (!meta.value) return [];
    return sortBy(meta.value.carType, "order");
  });

  // Periods (excluding FOREIGN type)
  const periods = computed(() => {
    if (!meta.value) return [];
    return sortBy(
      meta.value.period.filter((p) => p.periodType !== OsgoPeriodType.FOREIGN),
      "order",
    );
  });

  // All periods (including FOREIGN)
  const allPeriods = computed(() => {
    if (!meta.value) return [];
    return sortBy(meta.value.period, "order");
  });

  // Incident Frequencies
  const incidentFrequencies = computed(() => {
    if (!meta.value) return [];
    return sortBy(meta.value.incidentFrequency, "order");
  });

  // Drived Areas
  const drivedAreas = computed(() => {
    if (!meta.value) return [];
    return sortBy(meta.value.drivedArea, "order");
  });

  // Beneficiaries
  const beneficiaries = computed(() => {
    if (!meta.value) return [];
    return sortBy(meta.value.beneficiary, "order");
  });

  // Relatives
  const relatives = computed(() => {
    if (!meta.value) return [];
    return sortBy(meta.value.relative, "order");
  });

  /**
   * Load metadata from localStorage cache
   */
  const loadFromCache = (): boolean => {
    if (typeof window === "undefined") return false;

    try {
      const cached = localStorage.getItem(STORAGE_KEYS.ECCLIVO_META);
      if (!cached) return false;

      const parsed = JSON.parse(cached) as EcclivoMeta;
      meta.value = parsed;
      console.log("[MetaStore] Loaded from cache, version:", parsed.version);
      return true;
    } catch (err) {
      console.error("[MetaStore] Error loading cache:", err);
      return false;
    }
  };

  /**
   * Save metadata to localStorage cache
   */
  const saveToCache = () => {
    if (typeof window === "undefined" || !meta.value) return;

    try {
      const json = JSON.stringify(meta.value);
      localStorage.setItem(STORAGE_KEYS.ECCLIVO_META, json);
      console.log("[MetaStore] Saved to cache, version:", meta.value.version);
    } catch (err) {
      console.error("[MetaStore] Error saving cache:", err);
    }
  };

  /**
   * Clear metadata cache
   */
  const clearCache = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(STORAGE_KEYS.ECCLIVO_META);
    console.log("[MetaStore] Cache cleared");
  };

  /**
   * Fetch metadata from API - exact copy from website
   */
  const fetchMeta = async (): Promise<void> => {
    const api = useApi();
    fetching.value = true;
    error.value = null;

    try {
      console.log("[MetaStore] Starting fetchMeta...");

      const cached = localStorage.getItem(STORAGE_KEYS.ECCLIVO_META);
      if (cached) {
        meta.value = JSON.parse(cached) as EcclivoMeta;
        console.log("[MetaStore] Loaded from cache:", meta.value?.version);
      }

      console.log("[MetaStore] Calling getOsgoDataVersion...");
      const versionResponse = await api.invokeService(
        "OsgoService",
        "getOsgoDataVersion",
      );
      console.log("[MetaStore] Version response:", versionResponse);
      console.log("[MetaStore] Version response type:", typeof versionResponse);
      console.log(
        "[MetaStore] Version response keys:",
        versionResponse ? Object.keys(versionResponse) : "null",
      );

      // Handle different response formats - just coerce to number
      let versionData: number;
      console.log("[MetaStore] Version response:", versionResponse);
      console.log("[MetaStore] Version response type:", typeof versionResponse);

      // Check if it has a .data property (wrapped response)
      if (
        versionResponse &&
        typeof versionResponse === "object" &&
        "data" in versionResponse
      ) {
        console.log("[MetaStore] Wrapped response, extracting .data");
        versionData = Number((versionResponse as any).data);
      } else {
        // Direct response - just convert to number
        console.log("[MetaStore] Direct response, converting to number");
        versionData = Number(versionResponse);
      }

      if (isNaN(versionData)) {
        console.error("[MetaStore] Failed to parse version:", versionResponse);
        throw new Error("Invalid version response format");
      }

      console.log("[MetaStore] Extracted version:", versionData);
      console.log("[MetaStore] Cached version:", meta.value?.version);

      if (versionData !== meta.value?.version) {
        console.log("[MetaStore] Version mismatch, fetching new data...");

        const dataResponse = await api.invokeService(
          "OsgoService",
          "getOsgoData",
        );
        console.log("[MetaStore] Data response:", dataResponse);

        // Check if response has .data property (wrapped)
        let metaData: any;
        if (
          dataResponse &&
          typeof dataResponse === "object" &&
          "data" in dataResponse
        ) {
          console.log("[MetaStore] Wrapped data response");
          metaData = (dataResponse as any).data;
        } else {
          console.log("[MetaStore] Direct data response");
          metaData = dataResponse;
        }

        console.log(
          "[MetaStore] Extracted meta data version:",
          metaData?.version,
        );

        const data: EcclivoMeta = {
          version: metaData.version,
          carType: sortBy(metaData.carType, "order"),
          beneficiary: sortBy(metaData.beneficiary, "order"),
          drivedArea: sortBy(metaData.drivedArea, "order"),
          incidentFrequency: sortBy(metaData.incidentFrequency, "order"),
          period: sortBy(metaData.period, "order"),
          relative: sortBy(metaData.relative, "order"),
          periodType: sortBy(metaData.periodType, "order"),
        };

        console.log("[MetaStore] Processed data:", {
          version: data.version,
          carTypeCount: data.carType.length,
          periodCount: data.period.length,
        });

        meta.value = data;
        localStorage.setItem(
          STORAGE_KEYS.ECCLIVO_META,
          JSON.stringify(meta.value),
        );
        console.log("[MetaStore] Saved to localStorage");
      } else {
        console.log("[MetaStore] Version matches, using cached data");
      }
    } catch (err) {
      console.error("[MetaStore] Error in fetchMeta:", err);
      console.error("[MetaStore] Error type:", typeof err);
      console.error("[MetaStore] Error details:", {
        message: (err as any)?.message,
        stack: (err as any)?.stack,
      });

      // Clear cached data
      localStorage.removeItem(STORAGE_KEYS.ECCLIVO_META);
      error.value = (err as any).message || "Failed to fetch metadata";
      throw err;
    } finally {
      fetching.value = false;
      console.log(
        "[MetaStore] Fetch complete. Meta loaded:",
        meta.value !== null,
      );
    }
  };

  /**
   * Lazy fetch - only if not loaded
   */
  const lazyFetch = async (): Promise<void> => {
    if (isLoaded.value) return;
    await fetchMeta();
  };

  /**
   * Find car type by ID
   */
  const findCarType = (id: string): CarType | undefined => {
    return carTypes.value.find((ct) => ct.id === id);
  };

  /**
   * Find period by ID
   */
  const findPeriod = (id: string): Period | undefined => {
    return allPeriods.value.find((p) => p.id === id);
  };

  /**
   * Find incident frequency by coefficient
   */
  const findIncidentFrequency = (
    coefficient: number,
  ): IncidentFrequency | undefined => {
    return incidentFrequencies.value.find((f) => f.coefficient === coefficient);
  };

  /**
   * Find drived area by ID
   */
  const findDrivedArea = (id: string): DrivedArea | undefined => {
    return drivedAreas.value.find((a) => a.id === id);
  };

  /**
   * Find drived area by vehicle region code
   */
  const findDrivedAreaByRegion = (
    regionCode: number,
  ): DrivedArea | undefined => {
    return drivedAreas.value.find((a) => a.vehicleRegionCode === regionCode);
  };

  /**
   * Find beneficiary by coefficient
   */
  const findBeneficiary = (coefficient: number): Beneficiary | undefined => {
    return beneficiaries.value.find((b) => b.coefficient === coefficient);
  };

  /**
   * Get default discount type (coefficient = 1)
   */
  const getDefaultDiscountType = (): Beneficiary | undefined => {
    return beneficiaries.value.find((b) => b.coefficient === 1);
  };

  /**
   * Get localized name
   */
  const getLocalizedName = (item: any, locale: string = "ru"): string => {
    if (!item) return "";
    if (locale === "uz" && item.nameUz) return item.nameUz;
    return item.name || item.nameUz || "";
  };

  /**
   * Reset store
   */
  const reset = () => {
    meta.value = null;
    fetching.value = false;
    error.value = null;
    lastFetchTime.value = null;
  };

  return {
    // State
    meta,
    fetching,
    error,
    lastFetchTime,

    // Computed
    isLoaded,
    version,
    carTypes,
    periods,
    allPeriods,
    incidentFrequencies,
    drivedAreas,
    beneficiaries,
    relatives,

    // Actions
    fetchMeta,
    lazyFetch,
    loadFromCache,
    saveToCache,
    clearCache,

    // Helpers
    findCarType,
    findPeriod,
    findIncidentFrequency,
    findDrivedArea,
    findDrivedAreaByRegion,
    findBeneficiary,
    getDefaultDiscountType,
    getLocalizedName,

    // Reset
    reset,
  };
});
