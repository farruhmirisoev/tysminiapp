import { defineStore } from "pinia";

import { AjaxError, fetchEntities } from "@/misc/rest";
import { OsgopVehicleType } from "@/models/entities/osgopVehicleType";

interface VehicleTypesState {
  list: OsgopVehicleType[];
  fetching: boolean;
  fetchingError: AjaxError | null;
}

export const useVehicleTypesStore = defineStore("vehicleTypes", {
  state: (): VehicleTypesState => ({
    list: [],
    fetching: false,
    fetchingError: null,
  }),

  actions: {
    async fetch() {
      this.fetching = true;
      this.fetchingError = null;

      try {
        const response = await fetchEntities(OsgopVehicleType.NAME);
        this.list = <OsgopVehicleType[]>response.data;
      } catch (e) {
        this.fetchingError = <AjaxError>e;
      } finally {
        this.fetching = false;
      }
    },

    lazyFetch() {
      return this.list.length ? this.list : this.fetch();
    },
  },
});
