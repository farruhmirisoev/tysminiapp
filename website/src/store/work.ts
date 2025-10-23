import _ from "lodash";
import dayjs from "dayjs";
import { defineStore } from "pinia";

import { AjaxError, invokeService } from "@/misc/rest";
import { Work } from "@/models/entities/insurance_Work";
import { WorkType } from "@/models/enums/enums";

interface WorkState {
  data: Work[] | null;
  fetching: boolean;
  fetchingError: AjaxError | null;
}

export const useWorkStore = defineStore("work", {
  state: (): WorkState => ({
    data: null,
    fetching: false,
    fetchingError: null,
  }),

  getters: {
    getWorkService() {
      return (workType: WorkType): Work | null | undefined => {
        const item = _.find(this.data, { workType });

        if (item) {
          const from = dayjs(dayjs().format("YYYY-MM-DD") + " " + item.from);
          const to = dayjs(dayjs().format("YYYY-MM-DD") + " " + item.to);

          if (dayjs().isBefore(from) || dayjs().isAfter(to)) {
            return null;
          }
        }

        return item;
      };
    },
  },

  actions: {
    async fetch() {
      this.fetching = true;
      this.fetchingError = null;

      if (!this.data) {
        try {
          const response = (await invokeService("workService", "getWork")) as {
            data: { result: Work[] };
          };
          this.data = response.data.result;
        } catch (e) {
          this.fetchingError = <AjaxError>e;
        } finally {
          this.fetching = false;
        }
      }
    },

    async lazyFetch() {
      return this.data ?? this.fetch();
    },
  },
});
