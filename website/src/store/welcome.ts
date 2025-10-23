import { defineStore } from "pinia";

import { AjaxError, fetchInfo } from "@/misc/rest";
import type { Welcome } from "@/models/welcome.model";

interface WelcomeState {
  data: Welcome | null;
  fetching: boolean;
  fetchingError: AjaxError | null;
}

export const useWelcomeStore = defineStore("welcome", {
  state: (): WelcomeState => ({
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
          const data = await fetchInfo("main/info/");
          this.data = <Welcome>data;
        } catch (e) {
          this.fetchingError = <AjaxError>e;
        } finally {
          this.fetching = false;
        }
      }
    },
  },
});
