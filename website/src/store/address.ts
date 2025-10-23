import { defineStore } from "pinia";

import { AjaxError, fetchEntities } from "@/misc/rest";
import { DicCountry } from "@/models/entities/base/base$DicCountry";
import { DicDistrict } from "@/models/entities/base/base$DicDistrict";
import { DicRegion } from "@/models/entities/base/base$DicRegion";

interface AddressState {
  counties: DicCountry[];
  regions: DicRegion[];
  districts: DicDistrict[];
  fetching: boolean;
  fetchingError: AjaxError | null;
}

export const useAddressStore = defineStore("address", {
  state: (): AddressState => ({
    counties: [],
    regions: [],
    districts: [],
    fetching: false,
    fetchingError: null,
  }),

  actions: {
    async fetch() {
      this.fetching = true;
      this.fetchingError = null;

      try {
        let response = await fetchEntities("base$DicCountry");
        this.counties = <DicCountry[]>response.data;

        response = await fetchEntities("base$DicRegion");
        this.regions = <DicRegion[]>response.data;

        response = await fetchEntities("base$DicDistrict");
        this.districts = <DicDistrict[]>response.data;
      } catch (e) {
        this.fetchingError = <AjaxError>e;
      } finally {
        this.fetching = false;
      }
    },

    lazyFetch() {
      if (
        !this.counties.length ||
        !this.regions.length ||
        !this.districts.length
      ) {
        return this.fetch();
      }
    },
  },
});
