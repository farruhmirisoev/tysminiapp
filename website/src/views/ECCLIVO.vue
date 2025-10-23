<template>
  <div class="pb-20">
    <router-link
      v-if="osgo.id"
      :to="{ name: 'policies-list' }"
      class="block mb-4 text-sm font-medium text-primary hover:text-primary-light"
    >
      <span aria-hidden="true">&larr;</span>
      {{ $t('policy.list') }}
    </router-link>

    <div class="text-2xl font-bold">{{ $t('policy.osgo.title') }}</div>
    <div class="text-sm font-light">
      {{ $t('policy.osgo.description') }}
    </div>

    <Tabs v-model="tab" :options="TABS" class="my-6" />

    <transition name="fade" mode="out-in">
      <Params
        v-if="tab === 0 && !!meta"
        v-model="osgo"
        :meta="meta"
        :editable="editable"
      />
      <VehicleForm
        v-else-if="tab === 1 && osgo.vehicle"
        v-model="osgo.vehicle"
        :editable="editable"
      />
      <div v-else-if="tab === 2">
        <IndividualForm
          v-model="owner"
          :title="$t('policy.osgo.owner')"
          :editable="editable"
        >
          <label class="flex items-center mt-4 text-sm">
            <input
              v-model="applicantIsOwner"
              type="checkbox"
              class="mr-2 checkbox"
              :disabled="!editable"
            />
            {{ $t('policy.osgo.ownerIsApplicant') }}
          </label>
        </IndividualForm>
        <transition name="fade">
          <IndividualForm
            v-if="!applicantIsOwner"
            v-model="applicant"
            class="mt-4"
            :title="$t('policy.osgo.applicant')"
            :editable="editable"
          />
        </transition>
      </div>
      <div v-else-if="tab === 3">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div class="text-lg font-bold">{{ $t('policy.osgo.drivers.title') }}</div>
            <div class="text-sm font-light">
              {{ $t('policy.osgo.drivers.description') }}
            </div>
          </div>
          <div v-if="editable" class="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              class="text-sm btn btn-primary-outlined"
              @click="addDriver()"
            >
              {{ $t('policy.osgo.drivers.add') }}
            </button>
            <button
              v-if="
                !hasSameDriver(
                  owner.passportSeries,
                  owner.passportNumber,
                  owner.birthDate
                )
              "
              type="button"
              class="text-sm btn btn-primary-outlined"
              @click="
                addDriver(
                  owner.passportSeries,
                  owner.passportNumber,
                  owner.birthDate
                )
              "
            >
              {{ $t('policy.osgo.drivers.ownerIsDriver') }}
            </button>
            <button
              v-if="
                !osgo.applicantIsOwner &&
                !hasSameDriver(
                  applicant.passportSeries,
                  applicant.passportNumber,
                  applicant.birthDate
                )
              "
              type="button"
              class="text-sm btn btn-primary-outlined"
              @click="
                addDriver(
                  applicant.passportSeries,
                  applicant.passportNumber,
                  applicant.birthDate
                )
              "
            >
              {{ $t('policy.osgo.drivers.applicantIsDriver') }}
            </button>
          </div>
        </div>
        <DriverForm
          v-for="(driver, index) in osgo.drivers"
          class="mt-4"
          :editable="editable"
          :model-value="driver"
          :title="$t('policy.osgo.drivers.driverNumber', { number: index + 1 })"
          :key="index"
          :meta="meta"
          extended
          @update:model-value="(value) => updateDriver(index, value)"
        >
          <template v-if="editable" v-slot:actions>
            <button
              type="button"
              class="text-sm btn btn-danger-outlined"
              @click="removeDriver(index)"
            >
              {{ $t('policy.osgo.drivers.remove') }}
            </button>
          </template>
        </DriverForm>
      </div>
      <div v-else-if="tab === 4" class="grid gap-4 lg:grid-cols-2">
        <Summary
          v-model="osgo"
          :editable="editable"
          :owner="owner"
          :applicant="osgo.applicantIsOwner ? owner : applicant"
          @update:applicant="
            (value) =>
              osgo.applicantIsOwner ? (owner = value) : (applicant = value)
          "
        />
        <transition name="fade">
          <div v-if="osgo.id">
            <FundData
              v-if="fundData"
              :seria="fundData.seria"
              :number="_.padStart(fundData.number, 7, '0')"
              :data="applicant.phone!.replace(/[+()-]/g, '')"
            />
            <Payment
              v-else
              class="mb-8"
              :id="osgo.id!"
              :amount="amountPayable"
              :refresh="store.fetchFundData"
              :phone="applicant.phone!"
            />
          </div>
        </transition>
      </div>
    </transition>

    <hr class="my-6" />

    <div class="flex items-center justify-between">
      <button
        type="button"
        class="text-sm btn btn-primary-outlined"
        :disabled="!tab"
        @click="tab--"
      >
        <i class="text-xl bx bx-chevron-left"></i>
        {{ $t('common.back') }}
      </button>
      <button
        type="button"
        class="text-sm btn btn-primary-outlined"
        :disabled="tab === TABS.length - 1"
        @click="tab++"
      >
        {{ $t('common.next') }}
        <i class="text-xl bx bx-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

import { BaseContractStatus, OsgoPeriodType } from "@/models/enums/enums";
import { Driver } from "@/models/entities/osgoDriver";
import { EntriesJournal } from "@/models/entities/accounting$EntriesJournal";
import { Individual } from "@/models/entities/base/base$Individual";
import { Osgo } from "@/models/entities/contract$Osgo";
import { useEcclivoStore } from "@/store/ecclivo";
import { Vehicle } from "@/models/entities/osgo_Vehicle";

import DriverForm from "@/components/ecclivo/Driver.vue";
import FundData from "@/components/common/FundData.vue";
import IndividualForm from "@/components/ecclivo/Individual.vue";
import Params from "@/components/ecclivo/Params.vue";
import Payment from "@/components/common/Payment.vue";
import Summary from "@/components/ecclivo/Summary.vue";
import Tabs from "@/components/common/Tabs.vue";
import VehicleForm from "@/components/ecclivo/Vehicle.vue";

const { t } = useI18n();

const TABS = computed(() => [
  t('policy.osgo.tabs.coverage'),
  t('policy.osgo.tabs.vehicle'),
  t('policy.osgo.tabs.owner'),
  t('policy.osgo.tabs.drivers'),
  t('policy.osgo.tabs.payment')
]);

const route = useRoute();
const store = useEcclivoStore();
const { meta, data, fundData } = storeToRefs(store);

const tab = ref(0);
const osgo = ref(new Osgo());
const applicant = ref(new Individual());
const owner = ref(new Individual());

osgo.value.vehicle = new Vehicle();
osgo.value.applicantIsOwner = true;
osgo.value.contractStartDate = dayjs().format("YYYY-MM-DD");
osgo.value.drivers = [];
osgo.value.status = BaseContractStatus.DRAFT;

// NOTE: This is required by BE but not visible in UI
osgo.value.discountType = meta.value?.beneficiary.find(
  ({ coefficient }) => coefficient === 1
);

// Initialize data with default values (if any)
osgo.value.vehicle.govNumber = import.meta.env.VITE_VEHICLE_GOV_NUMBER;
osgo.value.vehicle.techPassportSeries =
  import.meta.env.VITE_VEHICLE_TECH_PASSPORT_SERIES;
osgo.value.vehicle.techPassportNumber =
  import.meta.env.VITE_VEHICLE_TECH_PASSPORT_NUMBER;
applicant.value.passportSeries = import.meta.env.VITE_PERSON_PASSPORT_SERIES;
applicant.value.passportNumber = import.meta.env.VITE_PERSON_PASSPORT_NUMBER;
applicant.value.birthDate = import.meta.env.VITE_PERSON_BIRTH_DATE;
owner.value.passportSeries = import.meta.env.VITE_PERSON_PASSPORT_SERIES;
owner.value.passportNumber = import.meta.env.VITE_PERSON_PASSPORT_NUMBER;
owner.value.birthDate = import.meta.env.VITE_PERSON_BIRTH_DATE;

const applicantIsOwner = computed({
  get: () => !!osgo.value.applicantIsOwner,
  set: (value) => (osgo.value.applicantIsOwner = value),
});

const editable = computed(() => osgo.value.status === BaseContractStatus.DRAFT);

const amountPayable = computed(() => {
  const entries = _.get(osgo.value, "entriesJournalKt", []) as EntriesJournal[];
  const paid = entries.reduce((sum, { amount }) => sum + (amount ?? 0), 0);
  return osgo.value.premium - paid;
});

function addDriver(
  passportSeries?: string | null,
  passportNumber?: string | null,
  birthDate?: string | null
) {
  const driver = new Driver();

  // Initialize driver with default values (if any)
  driver.passportSeries =
    passportSeries ?? import.meta.env.VITE_PERSON_PASSPORT_SERIES;
  driver.passportNumber =
    passportNumber ?? import.meta.env.VITE_PERSON_PASSPORT_NUMBER;
  driver.birthDate = birthDate ?? import.meta.env.VITE_PERSON_BIRTH_DATE;

  osgo.value.drivers?.push(driver);
}

function updateDriver(index: number, value: Driver) {
  osgo.value.drivers![index] = value;
}

function removeDriver(index: number) {
  osgo.value.drivers = osgo.value.drivers?.filter((_, i) => i !== index);
}

function hasSameDriver(
  passportSeries?: string | null,
  passportNumber?: string | null,
  birthDate?: string | null
) {
  return !!osgo.value.drivers?.find(
    (driver) =>
      driver.passportSeries === passportSeries &&
      driver.passportNumber === passportNumber &&
      driver.birthDate === birthDate
  );
}

// Update `drivedArea` when `vehicle.govNumber` changed
watch(
  () => osgo.value.vehicle?.govNumber,
  (value) => {
    if (value) {
      const regionCode = parseInt(value.slice(0, 2));
      const drivedArea = meta?.value?.drivedArea.find(
        (item) => item.vehicleRegionCode === regionCode
      );
      if (drivedArea) {
        osgo.value.drivedArea = drivedArea;
      }
    }
  }
);

// Update `contractToDate` when `contractFromDate` or `period` changed
watch(
  () => [osgo.value.contractStartDate, osgo.value.period],
  () => {
    const { contractStartDate, period } = osgo.value;

    if (contractStartDate && period) {
      let endDate = dayjs(contractStartDate);

      if (
        period.periodType === OsgoPeriodType.ONE_YEAR ||
        period.periodType === OsgoPeriodType.SEASON
      ) {
        endDate = endDate.add(period.months!, "months");
      } else if (period.periodType === OsgoPeriodType.TILL_REGISTRATION) {
        endDate = endDate.add(period.days!, "days");
      }

      osgo.value.contractEndDate = endDate
        .subtract(1, "days")
        .format("YYYY-MM-DD");
    }
  }
);

// Update `periodType` when `period` changed
watch(
  () => osgo.value.period,
  (value) => {
    if (value) {
      osgo.value.periodType = value.periodType;
    }
  }
);

watch(
  () => route.params.id,
  (id) => {
    if (id) {
      store.clear();
      store.fetch(id as string);
    }
  },
  { immediate: true }
);

watch(data, (value) => {
  osgo.value = value!;
  applicant.value = value?.party!;
  owner.value = value?.beneficiary!;

  if (osgo.value.vehicle) {
    osgo.value.vehicle.carType = meta.value?.carType.find(
      (item) => item.id === osgo.value.vehicle?.carType?.id
    );
  }
  if (osgo.value.driversLimited) {
    osgo.value.incidentCoeff = osgo.value.drivers
      ?.map((item) => item.incidentFrequency?.coefficient as number)
      ?.reduce((a, b) => Math.max(a, b), 0);
  }
  osgo.value.period = meta.value?.period.find(
    (item) => item.id === osgo.value.period?.id
  );
  osgo.value.drivedArea = meta.value?.drivedArea.find(
    (item) => item.id === osgo.value.drivedArea?.id
  );

  store.fetchFundData();
});
</script>
