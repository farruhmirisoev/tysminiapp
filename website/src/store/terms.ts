import { defineStore } from "pinia";

import { AjaxError, fetchInfo } from "@/misc/rest";
import type { Terms } from "@/models/terms.model";

interface TermsState {
  data: Terms | null;
  fetching: boolean;
  fetchingError: AjaxError | null;
}

export const useTermsStore = defineStore("terms", {
  state: (): TermsState => ({
    data: null,
    fetching: false,
    fetchingError: null,
  }),

  actions: {
    async fetch() {
      this.fetching = true;
      this.fetchingError = null;

      if (!this.data) {
        try {
          const response = await fetchInfo("main/terms/");
          this.data = <Terms>response.data?.[0];
        } catch (e) {
          this.fetchingError = <AjaxError>e;
        } finally {
          this.fetching = false;
        }
      }
    },
  },
});
