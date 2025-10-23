import { defineStore } from "pinia";

import { ContractExt } from "@/models/entities/base$ContractExt";
import { Osgo } from "@/models/entities/contract$Osgo";
import rest, { type AjaxError } from "@/misc/rest";
import _ from "lodash";

interface PoliciesState {
  list: ContractExt[];
  params: any;

  fetching: boolean;
  fetchError: AjaxError | null;

  copyId: string | null;
  saving: boolean;
  saveError: AjaxError | null;
}

export const usePoliciesStore = defineStore("policies", {
  state: (): PoliciesState => ({
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
        const response = await rest.fetchEntities<ContractExt>(
          ContractExt.NAME,
          this.params
        );
        const contracts = response.data;

        // Second requests: fetch Osgo for each osgo-contract and add govNumber to each contract
        const enrichedList = await Promise.all(
          contracts.map(async (item) => {
            if(_.get(item, '_entityName') === Osgo.NAME){
              const { data } = await rest.fetchEntity<Osgo>(
                Osgo.NAME,
                item.id,
                { view: "osgo-front-view" }
              );
              // Add govNumber to the contract object
              return {
                ...item,
                govNumber: data.vehicle?.govNumber || null,
              };
            } else return item;
          })
        );

        this.list = enrichedList;

      } catch (err) {
        this.fetchError = err as AjaxError;
      } finally {
        this.fetching = false;
      }
    },

    reload() {
      return this.fetch(this.params);
    },

    async copy(id: string) {
      this.copyId = id;
      this.saving = true;
      this.saveError = null;

      try {
        await rest.invokeService("OsgoService", "copyOsgoContract", {
          method: "POST",
          data: { id },
        });

        this.reload();
      } catch (err) {
        this.saveError = err as AjaxError;
      } finally {
        this.saving = false;
      }
    },
  },
});
