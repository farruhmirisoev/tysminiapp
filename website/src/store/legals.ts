import { defineStore } from "pinia";

import { AjaxError, fetchEntities } from "@/misc/rest";
import { DicOrgLegalFormType } from "@/models/entities/base/base$DicOrgLegalFormType";

interface LegalsState {
  list: DicOrgLegalFormType[];
  fetching: boolean;
  fetchingError: AjaxError | null;
}

export const useLegalsStore = defineStore("legals", {
  state: (): LegalsState => ({
    list: [],
    fetching: false,
    fetchingError: null,
  }),

  actions: {
    async fetch() {
      this.fetching = true;
      this.fetchingError = null;

      try {
        const response = await fetchEntities("base$DicOrgLegalFormType", {
          view: "_minimal",
        });
        this.list = <DicOrgLegalFormType[]>response.data;
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
