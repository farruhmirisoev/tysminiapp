import { defineStore } from "pinia";

import { AjaxError, fetchEntities } from "@/misc/rest";
import { Bank } from "@/models/entities/base/base$Bank";

interface BanksState {
  list: Bank[];
  fetching: boolean;
  fetchingError: AjaxError | null;
}

export const useBanksStore = defineStore("banks", {
  state: (): BanksState => ({
    list: [],
    fetching: false,
    fetchingError: null,
  }),

  actions: {
    async fetch() {
      this.fetching = true;
      this.fetchingError = null;

      try {
        const response = await fetchEntities("base$Bank", {
          view: "_minimal",
        });
        this.list = <Bank[]>response.data;
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
