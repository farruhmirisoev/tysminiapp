<template>
  <div>
    <div class="mb-4 text-2xl font-bold">
      {{ $t('main.policies.list.title') }}
      <span class="text-gray-700">
        <i v-if="fetching" class="bx bx-loader-alt bx-spin"></i>
        <span v-else>({{ list.length }})</span>
      </span>
    </div>

    <template v-for="item in list" :key="item.id">
      <EcclivoCard
        v-if="_.get(item, '_entityName') === Osgo.NAME"
        :data="item"
        class="mb-2"
      />
      <OsgorCard
        v-if="_.get(item, '_entityName') === Osgor.NAME"
        :data="item"
        class="mb-2"
      />
      <OsgopCard
        v-if="_.get(item, '_entityName') === Osgop.NAME"
        :data="item"
        class="mb-2"
      />
    </template>

    <transition name="fade">
      <div v-if="fetchError" class="mt-4 text-sm text-red-600">
        {{ fetchError }}
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import _ from "lodash";
import { storeToRefs } from "pinia";

import { Osgo } from "@/models/entities/contract$Osgo";
import { Osgop } from "@/models/entities/osgop_Osgop";
import { Osgor } from "@/models/entities/osgor_Osgor";
import { useAuthStore } from "@/store/auth";
import { usePoliciesStore } from "@/store/policies";

import EcclivoCard from "@/components/ecclivo/Card.vue";
import OsgopCard from "@/components/osgop/Card.vue";
import OsgorCard from "@/components/osgor/Card.vue";

const store = usePoliciesStore();
const user = storeToRefs(useAuthStore()).data;
const { list, fetching, fetchError } = storeToRefs(store);

store.fetch({
  userId: user.value.id,
  sort: "contractStartDate",
  view: "contractExt-front-list-view",
});
</script>
