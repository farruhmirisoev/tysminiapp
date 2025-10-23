import { defineStore } from "pinia";

import { AjaxError, fetchEntities } from "@/misc/rest";
import { OsgopPeriod } from "@/models/entities/OsgopPeriod";

interface PeriodsState {
  list: OsgopPeriod[];
  fetching: boolean;
  fetchingError: AjaxError | null;
}

export const usePeriodsStore = defineStore("periods", {
  state: (): PeriodsState => ({
    list: [],
    fetching: false,
    fetchingError: null,
  }),

  actions: {
    async fetch() {
      this.fetching = true;
      this.fetchingError = null;

      try {
        const response = await fetchEntities(OsgopPeriod.NAME);
        this.list = <OsgopPeriod[]>response.data;
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
