import _ from "lodash";
import { defineStore } from "pinia";

import { AjaxError } from "@/misc/rest";
import { Company } from "@/models/entities/base/base$Company";
import { Individual } from "@/models/entities/base/base$Individual";
import { Osgor } from "@/models/entities/osgor_Osgor";
import rest from "@/misc/rest";

interface OsgorState {
  data: Osgor | null;
  saving: boolean;
  saveError: AjaxError | null;

  fetching: boolean;
  fetchError: AjaxError | null;

  fundData: { number: string; seria: string } | null;
  fundError: string | null;
  fetchingFundData: boolean;
}

export const useOsgorStore = defineStore("osgor", {
  state: (): OsgorState => ({
    data: null,
    saving: false,
    saveError: null,

    fetching: false,
    fetchError: null,

    fundData: null,
    fundError: null,
    fetchingFundData: false,
  }),

  actions: {
    async create(data: any) {
      this.saving = true;
      this.saveError = null;

      try {
        const response = (await rest.invokeService(
          "OsgorService",
          "createOsgorApplication",
          {
            method: "POST",
            data,
          }
        )) as { data: { error: AjaxError; result: { id: string } } };

        if (response.data.error) {
          rest.handleError({ response });
        }

        return response.data.result.id;
      } catch (err) {
        this.saveError = err as AjaxError;
        throw err;
      } finally {
        this.saving = false;
      }
    },

    async update(data: any) {
      this.saving = true;
      this.saveError = null;

      try {
        const response = (await rest.invokeService(
          "OsgorService",
          "updateOsgorApplication",
          {
            method: "POST",
            data,
          }
        )) as { data: { error: AjaxError; result: boolean } };

        if (response.data.error) {
          rest.handleError({ response });
        }

        return response.data.result;
      } catch (err) {
        this.saveError = err as AjaxError;
        throw err;
      } finally {
        this.saving = false;
      }
    },

    async fetch(id: string) {
      this.fetching = true;
      this.fetchError = null;

      try {
        const { data } = await rest.fetchEntity<Osgor>(Osgor.NAME, id, {
          view: "osgor-view",
        });

        const isCompany = data.partyType === "COMPANY";
        const type = isCompany ? Company : Individual;

        data.party = (
          await rest.fetchEntity<type>(type.NAME, data.party?.id!, {
            view: isCompany ? "company-view" : "individual-view",
          })
        ).data;

        this.data = data;
      } catch (err) {
        this.fetchError = new AjaxError(err);
        throw err;
      } finally {
        this.fetching = false;
      }
    },

    async fetchFundData() {
      this.fetchingFundData = true;

      try {
        const response = (await rest.invokeService(
          "OsgorService",
          "getFundPolicyOsgor",
          {
            method: "POST",
            data: {
              id: this.data?.id,
            },
          }
        )) as {
          data: {
            result?: { number: string; seria: string };
            error?: { message: string };
          };
        };

        if (response.data.error) {
          this.fundError = response.data.error.message;
        } else if (response.data.result) {
          this.fundData = response.data.result;
        } else {
          this.fundData = null;
        }
      } finally {
        this.fetchingFundData = false;
      }
    },

    clear() {
      this.data = null;
      this.saving = false;
      this.saveError = null;
      this.fetching = false;
      this.fetchError = null;
      this.fundData = null;
      this.fundError = null;
      this.fetchingFundData = false;
    },
  },
});
