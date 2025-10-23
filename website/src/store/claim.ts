import _ from "lodash";
import { defineStore } from "pinia";

import { AjaxError } from "@/misc/rest";
import { Attachment } from "@/models/entities/base/base$Attachment";
import { Claim } from "@/models/entities/baseClaim";
import rest from "@/misc/rest";

interface ClaimState {
  data: Claim | null;
  saving: boolean;
  saveError: AjaxError | null;

  fetching: boolean;
  fetchError: AjaxError | null;

  uploading: boolean;
  uploadError: AjaxError | null;
}

export const useClaimStore = defineStore("claim", {
  state: (): ClaimState => ({
    data: null,
    saving: false,
    saveError: null,

    fetching: false,
    fetchError: null,

    uploading: false,
    uploadError: null,
  }),

  actions: {
    async create(data: any) {
      this.saving = true;
      this.saveError = null;

      try {
        const response = (await rest.invokeService(
          "ClaimOnlineService",
          "createClaim",
          {
            method: "POST",
            data,
          }
        )) as { data: { error: AjaxError; result: { id: string } } };

        if (response.data.error) {
          rest.handleError({ response });
        }

        return response.data.result.claimId;
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
        const { data } = await rest.fetchEntity<Claim>(Claim.NAME, id, {
          view: "claim-online-view",
        });

        this.data = data;
      } catch (err) {
        this.fetchError = new AjaxError(err);
        throw err;
      } finally {
        this.fetching = false;
      }
    },

    async upload(file: File) {
      this.uploading = true;
      this.uploadError = null;

      try {
        const data = await rest.uploadFile(file);

        await rest.createEntity<Attachment>(Attachment.NAME, {
          contract: { id: this.data.id },
          file: data,
          name: _.get(data, "name"),
          number: Math.round(Math.random() * 1000),
        });

        this.fetch(this.data.id);
      } catch (err) {
        this.uploadError = new AjaxError(err);
        throw err;
      } finally {
        this.uploading = false;
      }
    },

    clear() {
      this.data = null;
      this.saving = false;
      this.saveError = null;
      this.fetching = false;
      this.fetchError = null;
      this.uploading = false;
      this.uploadError = null;
    },
  },
});
