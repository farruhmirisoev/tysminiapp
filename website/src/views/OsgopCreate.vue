<template>
  <router-link
    v-if="osgop.id"
    :to="{ name: 'policies-list' }"
    class="block mb-4 text-sm font-medium text-primary hover:text-primary-light"
  >
    <span aria-hidden="true">&larr;</span>
    {{ $t('policy.list') }}
  </router-link>

  <div class="text-2xl font-bold">{{ $t('policy.osgop.title') }}</div>

  <div class="text-sm font-light">
    {{ $t('policy.osgop.description') }}
  </div>

  <Tabs v-model="tab" :options="TABS" class="my-6" />

  <transition name="fade" mode="out-in">
    <div v-if="tab === 0">
      <div v-if="!signed" class="grid grid-cols-2 gap-2">
        <CheckButton
          :title="$t('policy.legalEntity')"
          :active="isLegal"
          @click="isLegal = true"
        >
          {{ $t('policy.legalEntity') }}
        </CheckButton>

        <CheckButton
          :title="$t('policy.individual')"
          :active="!isLegal"
          @click="isLegal = false"
        >
          {{ $t('policy.individual') }}
        </CheckButton>
      </div>

      <CompanyForm
        v-if="isLegal"
        v-model="company"
        class="mt-4"
        :readonly="signed"
      />
      <IndividualForm
        v-else
        v-model="individual"
        class="mt-4"
        has-account
        :readonly="signed"
      />

      <div class="grid gap-4 mt-4 text-sm lg:grid-cols-3">
        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('policy.osgop.vehicle.type') }}
          <TypeDropdown
            v-model="vehicle.vehicleTypeOsgop"
            class="w-full"
            :disabled="signed"
          />
        </label>
      </div>

      <VehicleForm
        v-if="extended"
        v-model="vehicle"
        class="mt-4"
        :readonly="signed"
      />

      <div v-else class="grid gap-4 mt-4 text-sm lg:grid-cols-3">
        <label class="block text-sm font-medium text-gray-700">
          {{ $t('policy.osgop.vehicle.govNumber') }}
          <input
            :value="vehicle.govNumber"
            class="block w-full mt-1 input"
            :placeholder="$t('policy.osgop.vehicle.govNumberPlaceholder')"
            @input="setGovNumber"
            :disabled="signed"
          />
        </label>

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('policy.osgop.vehicle.model') }}
          <input
            v-model="vehicle.modelName"
            class="block w-full mt-1 input"
            :disabled="signed"
          />
        </label>

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('policy.osgop.vehicle.seats') }}
          <input
            v-model="vehicle.numberOfSeats"
            v-maska="'#######'"
            class="block w-full mt-1 input"
            :disabled="signed"
          />
        </label>
      </div>
    </div>

    <div v-else-if="tab === 1" class="grid gap-4 lg:grid-cols-2">
      <div>
        <Details
          :osgop="osgop"
          :company="isLegal ? company : null"
          :individual="!isLegal ? individual : null"
        />

        <div class="grid gap-4 mt-4 text-sm lg:grid-cols-2">
          <label
            class="block col-span-2 mt-auto text-sm font-medium text-gray-700"
          >
            {{ $t('policy.osgop.contract.period') }}
            <PeriodDropdown
              v-model="osgop.osgopPeriod"
              class="block w-full mt-1 input"
              :disabled="signed"
            />
          </label>

          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('policy.osgop.contract.startDate') }}
            <input
              v-model="osgop.contractStartDate"
              type="date"
              :min="dayjs().add(1, 'day').format('YYYY-MM-DD')"
              class="block w-full mt-1 input"
              :disabled="signed"
            />
          </label>

          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('policy.osgop.contract.endDate') }}
            <input
              type="date"
              :value="osgop.contractEndDate"
              :min="dayjs().format('YYYY-MM-DD')"
              class="block w-full mt-1 input"
              disabled
            />
          </label>
        </div>

        <transition name="fade">
          <div v-if="saveError" class="mt-4 text-red-600">
            {{ saveError }}
          </div>
        </transition>

        <button
          v-if="!signed"
          type="button"
          class="w-full mt-4 text-sm btn btn-primary"
          :disabled="invalid || saving"
          @click="save"
        >
          {{ osgop.id ? $t('policy.update') : $t('policy.send') }}
        </button>
      </div>

      <div v-if="osgop.id">
        <FundData
          v-if="fundData"
          :seria="fundData.seria"
          :number="_.padStart(fundData.number, 7, '0')"
          :data="data?.party?.phone!.replace(/[+()-]/g, '')"
        />
        <Payment
          v-else
          :id="osgop.id!"
          :amount="osgop.premium"
          :phone="osgop.party!.phone!"
          :refresh="store.fetchFundData"
        />
      </div>
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
</template>
<script setup lang="ts">
import _ from "lodash";
import dayjs from "dayjs";
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { BankAccount } from "@/models/entities/base/base_BankAccount";
import { BaseContractStatus } from "@/models/enums/enums";
import { Company } from "@/models/entities/base/base$Company";
import { Individual } from "@/models/entities/base/base$Individual";
import { Osgop } from "@/models/entities/osgop_Osgop";
import { useAuthStore } from "@/store/auth";
import { useOsgopStore } from "@/store/osgop";
import { Vehicle } from "@/models/entities/osgo_Vehicle";

import CheckButton from "@/components/calculator/CheckButton.vue";
import CompanyForm from "@/components/common/CompanyForm.vue";
import Details from "@/components/osgop/Details.vue";
import FundData from "@/components/common/FundData.vue";
import IndividualForm from "@/components/common/IndividualForm.vue";
import Payment from "@/components/common/Payment.vue";
import PeriodDropdown from "@/components/osgop/PeriodDropdown.vue";
import Tabs from "@/components/common/Tabs.vue";
import TypeDropdown from "@/components/osgop/TypeDropdown.vue";
import VehicleForm from "@/components/osgop/VehicleForm.vue";

const { t } = useI18n();

const TABS = computed(() => [
  t('policy.osgop.tabs.details'),
  t('policy.osgop.tabs.contract')
]);

const route = useRoute();
const router = useRouter();
const store = useOsgopStore();
const user = storeToRefs(useAuthStore()).data;

const { data, fundData, saving, saveError } = storeToRefs(store);

const tab = ref(0);
const isLegal = ref(true);
const osgop = ref(new Osgop());
const company = ref(new Company());
const individual = ref(new Individual());
const vehicle = ref(new Vehicle());

const extended = computed(() =>
  _.includes(["1", "2", "3"], vehicle.value.vehicleTypeOsgop?.id)
);

const invalid = computed(
  () =>
    _.isEmpty(osgop.value.contractStartDate) ||
    _.isEmpty(osgop.value.contractEndDate) ||
    (isLegal.value
      ? _.isEmpty(company.value.id) ||
        _.isEmpty(company.value.legalFormType?.id) ||
        _.isEmpty(company.value.phone) ||
        _.isEmpty(company.value.country?.id) ||
        _.isEmpty(company.value.region?.id) ||
        _.isEmpty(company.value.district?.id) ||
        _.isEmpty(company.value.street) ||
        _.isEmpty(company.value.accounts?.[0]?.bank?.id) ||
        (company.value.accounts?.[0]?.number?.length ?? 0) < 20 ||
        _.isEmpty(company.value.name) ||
        _.isEmpty(company.value.chiefName) ||
        _.isEmpty(company.value.account) ||
        _.isEmpty(vehicle.value.vehicleTypeOsgop?.id)
      : _.isEmpty(individual.value.id) ||
        _.isEmpty(individual.value.accounts?.[0]?.bank?.id) ||
        (individual.value.accounts?.[0]?.number?.length ?? 0) < 20) ||
    (extended.value
      ? _.isEmpty(vehicle.value.id)
      : _.isEmpty(vehicle.value.govNumber) ||
        _.isEmpty(vehicle.value.modelName) ||
        _.isEmpty(vehicle.value.numberOfSeats))
);

const signed = computed(() => osgop.value.status === BaseContractStatus.SIGNED);

watch(
  () => [osgop.value.contractStartDate, osgop.value.osgopPeriod],
  () => {
    if (osgop.value.contractStartDate && osgop.value.osgopPeriod) {
      osgop.value.contractEndDate = dayjs(osgop.value.contractStartDate)
        .add(osgop.value.osgopPeriod.months!, "month")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
    }
  }
);

osgop.value.contractStartDate = dayjs().add(1, "day").format("YYYY-MM-DD");
company.value.nationalIdentifier = import.meta.env.VITE_COMPANY_INN;
individual.value.passportNumber = import.meta.env.VITE_PERSON_PASSPORT_NUMBER;
individual.value.passportSeries = import.meta.env.VITE_PERSON_PASSPORT_SERIES;
individual.value.birthDate = import.meta.env.VITE_PERSON_BIRTH_DATE;
vehicle.value.govNumber = import.meta.env.VITE_VEHICLE_GOV_NUMBER;
vehicle.value.techPassportSeries =
  import.meta.env.VITE_VEHICLE_TECH_PASSPORT_SERIES;
vehicle.value.techPassportNumber =
  import.meta.env.VITE_VEHICLE_TECH_PASSPORT_NUMBER;

function save() {
  const payload = {
    ...osgop.value,
    party: isLegal.value ? company.value : individual.value,
    vehicle: {
      ...(extended.value
        ? vehicle.value
        : _.pick(
            vehicle.value,
            "vehicleTypeOsgop",
            "govNumber",
            "modelName",
            "numberOfSeats"
          )),
      osgopLossRatio: {
        id: "2",
        coefficient: 1.0,
      },
    },
  };

  // Remove all non-digits from phone number
  payload.party.phone = payload.party.phone?.replace(/[+()-]/g, "");

  if (osgop.value.id) {
    store.update({ osgop: payload });
  } else {
    store
      .create({
        user: user.value,
        osgop: payload,
      })
      .then((id) => {
        router.push({ name: "osgop-details", params: { id } });
      });
  }
}

function setGovNumber(event: Event) {
  const { value } = event.target as HTMLInputElement;
  vehicle.value.govNumber = value.toUpperCase().replace(/[^A-Z0-9\s]+/g, "");
}

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
  if (value) {
    isLegal.value = data.value!.partyType === "COMPANY";
    osgop.value = value!;
    vehicle.value = value.vehicle!;

    if (isLegal.value) {
      company.value = value.party as Company;
    } else {
      individual.value = value.party as Individual;

      // HACK: remove once BE starts to return accounts
      if (_.isEmpty(individual.value.accounts)) {
        individual.value.accounts = [new BankAccount()];
      }
    }

    store.fetchFundData();
  }
});
</script>
