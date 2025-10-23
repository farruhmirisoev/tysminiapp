import { defineStore } from "pinia";

import { AjaxError, fetchEntities } from "@/misc/rest";
import { DicOked } from "@/models/entities/base/base$DicOked";

interface OkedsState {
  list: DicOked[];
  fetching: boolean;
  fetchingError: AjaxError | null;
}

export const useOkedsStore = defineStore("okeds", {
  state: (): OkedsState => ({
    list: [],
    fetching: false,
    fetchingError: null,
  }),

  actions: {
    async fetch() {
      this.fetching = true;
      this.fetchingError = null;

      try {
        const response = await fetchEntities("base$DicOked", {
          view: "_minimal",
        });
        this.list = <DicOked[]>response.data;
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
