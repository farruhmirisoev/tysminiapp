import { defineStore } from "pinia";

import rest, { type AjaxError } from "@/misc/rest";
import { Claim } from "@/models/entities/baseClaim";

interface ClaimsState {
  list: Claim[];
  params: any;

  fetching: boolean;
  fetchError: AjaxError | null;

  copyId: string | null;
  saving: boolean;
  saveError: AjaxError | null;
}

export const useClaimsStore = defineStore("claims", {
  state: (): ClaimsState => ({
    list: [],
    params: null,

    fetching: false,
    fetchError: null,

    copyId: null,
    saving: false,
    saveError: null,
  }),

  actions: {
    async fetch(params: any) {
      this.fetching = true;
      this.fetchError = null;
      this.params = params;

      try {
        const response = await rest.fetchEntities<Claim>(
          Claim.NAME,
          this.params
        );
        this.list = response.data;
      } catch (err) {
        this.fetchError = err as AjaxError;
      } finally {
        this.fetching = false;
      }
    },

    reload() {
      return this.fetch(this.params);
    },
  },
});
