<template>
  <label class="block mt-auto text-sm font-medium text-gray-700">
    {{ $t('address.country') }}
    <select
      :value="props.country?.id"
      class="block w-full mt-1 input"
      :disabled="fetching || $props.disabled"
      @change="selectCountry"
    >
      <option v-for="item in sortedCountries" :value="item.id" :key="item.id">
        {{ item.langValue1 }}
      </option>
    </select>
  </label>

  <label class="block mt-auto text-sm font-medium text-gray-700">
    {{ $t('address.region') }}
    <select
      :value="props.region?.id"
      class="block w-full mt-1 input"
      :disabled="fetching || $props.disabled"
      @change="selectRegion"
    >
      <option v-for="item in sortedRegions" :value="item.id" :key="item.id">
        {{ item.langValue1 }}
      </option>
    </select>
  </label>

  <label class="block mt-auto text-sm font-medium text-gray-700"
    >{{ $t('address.district') }}
    <select
      :value="props.district?.id"
      class="block w-full mt-1 input"
      :disabled="fetching || $props.disabled"
      @change="selectDistrict"
    >
      <option v-for="item in sortedDistricts" :value="item.id" :key="item.id">
        {{ item.langValue1 }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";

import { useAddressStore } from "@/store/address";
import { DicCountry } from "@/models/entities/base/base$DicCountry";
import { DicRegion } from "@/models/entities/base/base$DicRegion";
import { DicDistrict } from "@/models/entities/base/base$DicDistrict";

const props = defineProps<{
  country?: DicCountry | null;
  region?: DicRegion | null;
  district?: DicDistrict | null;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "update:country", value?: DicCountry | null): void;
  (e: "update:region", value?: DicRegion | null): void;
  (e: "update:district", value?: DicDistrict | null): void;
}>();

const store = useAddressStore();

const { counties, regions, districts, fetching } = storeToRefs(store);

const sortedCountries = computed(() =>
  _.filter(
    _.sortBy(counties.value, "langValue1"),
    (item) => item.code! === "860"
  )
);
const sortedRegions = computed(() => _.sortBy(regions.value, "langValue1"));
const sortedDistricts = computed(() =>
  _.filter(_.sortBy(districts.value, "langValue1"), (item) =>
    _.startsWith(item.code!, props.region?.code!)
  )
);

function selectCountry(event: Event) {
  const { value } = event.target as HTMLInputElement;
  emit("update:country", _.find(sortedCountries.value, { id: value }));
}

function selectRegion(event: Event) {
  const { value } = event.target as HTMLInputElement;
  emit("update:region", _.find(sortedRegions.value, { id: value }));
}

function selectDistrict(event: Event) {
  const { value } = event.target as HTMLInputElement;
  emit("update:district", _.find(sortedDistricts.value, { id: value }));
}

store.lazyFetch();

watch(
  () => props.region,
  () => {
    if (props.district?.id) {
      emit(
        "update:district",
        _.find(sortedDistricts.value, { id: props.district!.id })
      );
    }
  }
);
</script>
