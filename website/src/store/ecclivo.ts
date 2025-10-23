import { defineStore } from "pinia";

import { AjaxError } from "@/misc/rest";
import { ECCLIVO } from "@/misc/storage";
import { Osgo } from "@/models/entities/contract$Osgo";
import { Individual } from "@/models/entities/base/base$Individual";
import rest from "@/misc/rest";
import type { EcclivoMeta } from "@/models/ecclivo_meta.model";
import _ from "lodash";

interface EcclivoState {
  meta: EcclivoMeta | null;
  fetchingMeta: boolean;
  fetchMetaError: AjaxError | null;

  data: Osgo | null;
  saving: boolean;
  saveError: AjaxError | null;

  fetching: boolean;
  fetchError: AjaxError | null;

  sendingPaymentLink: boolean;
  sendPaymentLinkError: AjaxError | null;

  fundData: { number: string; seria: string } | null;
  fundError: string | null;
  fetchingFundData: boolean;
}

export const useEcclivoStore = defineStore("ecclivo", {
  state: (): EcclivoState => ({
    meta: null,
    fetchingMeta: false,
    fetchMetaError: null,

    data: null,
    saving: false,
    saveError: null,

    fetching: false,
    fetchError: null,

    sendingPaymentLink: false,
    sendPaymentLinkError: null,

    fundData: null,
    fundError: null,
    fetchingFundData: false,
  }),

  actions: {
    async fetchMeta() {
      this.fetchingMeta = true;
      this.fetchMetaError = null;

      try {
        const cached = localStorage.getItem(ECCLIVO);
        if (cached) {
          this.meta = JSON.parse(cached) as EcclivoMeta;
        }

        const { data } = (await rest.invokeService(
          "OsgoService",
          "getOsgoDataVersion"
        )) as { data: number };

        if (data !== this.meta?.version) {
          const response = (await rest.invokeService(
            "OsgoService",
            "getOsgoData"
          )) as { data: EcclivoMeta };

          const data: EcclivoMeta = {
            version: response.data.version,
            carType: _.sortBy(response.data.carType, "order"),
            beneficiary: _.sortBy(response.data.beneficiary, "order"),
            drivedArea: _.sortBy(response.data.drivedArea, "order"),
            incidentFrequency: _.sortBy(
              response.data.incidentFrequency,
              "order"
            ),
            period: _.sortBy(response.data.period, "order"),
            relative: _.sortBy(response.data.relative, "order"),
            periodType: _.sortBy(response.data.periodType, "order"),
          };

          this.meta = data;
          localStorage.setItem(ECCLIVO, JSON.stringify(this.meta));
        }
      } catch (err) {
        // Clear cached data
        localStorage.removeItem(ECCLIVO);

        this.fetchMetaError = err as AjaxError;
      } finally {
        this.fetchingMeta = false;
      }
    },

    async create(data: any) {
      this.saving = true;
      this.saveError = null;

      try {
        const response = (await rest.invokeService(
          "OsgoService",
          "createOsgoApplication",
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
          "OsgoService",
          "updateOsgoApplication",
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
        const { data } = await rest.fetchEntity<Osgo>(Osgo.NAME, id, {
          view: "osgo-front-view",
        });

        data.party = (
          await rest.fetchEntity<Individual>(Individual.NAME, data.party?.id!, {
            view: "individual-front-view",
          })
        ).data;

        data.beneficiary = (
          await rest.fetchEntity<Individual>(
            Individual.NAME,
            data.beneficiary?.id!,
            { view: "individual-front-view" }
          )
        ).data;

        this.data = data;
      } catch (err) {
        this.fetchError = new AjaxError(err);
        throw err;
      } finally {
        this.fetching = false;
      }
    },

    async sendPaymentLink(method: string, payload: any) {
      this.sendingPaymentLink = true;
      this.sendPaymentLinkError = null;

      try {
        const response = (await rest.invokeService("BillingService", method, {
          method: "POST",
          data: payload,
        })) as { data: { error: any } };

        if (response.data.error) {
          rest.handleError({ response });
        }
      } catch (err) {
        this.sendPaymentLinkError = err as AjaxError;
        throw err;
      } finally {
        this.sendingPaymentLink = false;
      }
    },

    async fetchFundData() {
      this.fetchingFundData = true;

      try {
        const response = (await rest.invokeService(
          "OsgoService",
          "getFundPolicy",
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
