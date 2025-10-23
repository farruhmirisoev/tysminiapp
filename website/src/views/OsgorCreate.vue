<template>
  <router-link
    v-if="osgor.id"
    :to="{ name: 'policies-list' }"
    class="block mb-4 text-sm font-medium text-primary hover:text-primary-light"
  >
    <span aria-hidden="true">&larr;</span>
    {{ $t('policy.list') }}
  </router-link>

  <div class="text-2xl font-bold">{{ $t('policy.osgor.title') }}</div>

  <div class="text-sm font-light">
    {{ $t('policy.osgor.description') }}
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
        :activity-coefficient="osgor.activityCoefficient"
        :readonly="signed"
        class="mt-4"
      />
      <IndividualForm
        v-else
        v-model="individual"
        :readonly="signed"
        class="mt-4"
        has-account
      />

      <label class="block mt-4 text-sm font-medium text-gray-700">
        {{ $t('policy.osgor.salary') }}
        <input
          v-model="osgor.limitOfLiability"
          v-maska="'###############'"
          class="block w-full mt-1 input"
          :disabled="signed"
        />
      </label>
    </div>

    <div v-else-if="tab === 1" class="grid gap-4 lg:grid-cols-2">
      <div>
        <Details
          :osgor="osgor"
          :company="isLegal ? company : null"
          :individual="!isLegal ? individual : null"
        />

        <div class="grid gap-4 mt-4 text-sm lg:grid-cols-2">
          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('policy.osgor.contract.startDate') }}
            <input
              v-model="osgor.contractStartDate"
              type="date"
              :min="dayjs().add(1, 'day').format('YYYY-MM-DD')"
              class="block w-full mt-1 input"
              :disabled="signed"
            />
          </label>

          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('policy.osgor.contract.endDate') }}
            <input
              type="date"
              :value="osgor.contractEndDate"
              :min="dayjs().format('YYYY-MM-DD')"
              class="block w-full mt-1 input"
              disabled
            />
          </label>
        </div>

        <div class="flex items-center mt-4 text-sm">
          <input v-model="acceptTerms" type="checkbox" class="mr-2 checkbox" />
          <a
            href="https://tys.uz/products/yur-ustanovlennyy-zakonom-vid-strahovaniya-napravlennyy-na-vyplatu-kompensacii-poterpevshim-licam-postradavshim-pri-ispolnenii-svoih-sluzhebnyh-obyazannostey"
            target="_blank"
            class="text-primary hover:underline"
            >{{ $t('policy.acceptTerms') }}</a
          >
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
          {{ osgor.id ? $t('policy.update') : $t('policy.send') }}
        </button>
      </div>

      <div v-if="osgor.id">
        <FundData
          v-if="fundData"
          :seria="fundData.seria"
          :number="_.padStart(fundData.number, 7, '0')"
          :data="data?.party?.phone!.replace(/[+()-]/g, '')"
        />
        <Payment
          v-else
          :id="osgor.id!"
          :amount="osgor.premium"
          :phone="osgor.party!.phone!"
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

import { ActivityCoefficient } from "@/models/entities/reference_OsgorActivityCoefficient";
import { BankAccount } from "@/models/entities/base/base_BankAccount";
import { BaseContractStatus } from "@/models/enums/enums";
import { Company } from "@/models/entities/base/base$Company";
import { Individual } from "@/models/entities/base/base$Individual";
import { invokeQuery } from "@/misc/rest";
import { Osgor } from "@/models/entities/osgor_Osgor";
import { useAuthStore } from "@/store/auth";
import { useOsgorStore } from "@/store/osgor";

import CheckButton from "@/components/calculator/CheckButton.vue";
import CompanyForm from "@/components/common/CompanyForm.vue";
import Details from "@/components/osgor/Details.vue";
import FundData from "@/components/common/FundData.vue";
import IndividualForm from "@/components/common/IndividualForm.vue";
import Payment from "@/components/common/Payment.vue";
import Tabs from "@/components/common/Tabs.vue";

const { t } = useI18n();

const TABS = computed(() => [
  t('policy.osgor.tabs.coverage'),
  t('policy.osgor.tabs.payment')
]);

const route = useRoute();
const router = useRouter();
const store = useOsgorStore();
const user = storeToRefs(useAuthStore()).data;

const { data, fundData, saving, saveError } = storeToRefs(store);

const acceptTerms = ref(false);
const tab = ref(0);
const isLegal = ref(true);
const osgor = ref(new Osgor());
const company = ref(new Company());
const individual = ref(new Individual());

const invalid = computed(
  () =>
    !acceptTerms.value ||
    _.isEmpty(_.toString(osgor.value.limitOfLiability)) ||
    _.isEmpty(osgor.value.contractStartDate) ||
    _.isEmpty(osgor.value.contractEndDate) ||
    (isLegal.value
      ? _.isEmpty(osgor.value.activityCoefficient?.id) ||
        _.isEmpty(company.value.id) ||
        _.isEmpty(company.value.legalFormType?.id) ||
        _.isEmpty(company.value.oked?.id) ||
        _.isEmpty(company.value.phone) ||
        _.isEmpty(company.value.country?.id) ||
        _.isEmpty(company.value.region?.id) ||
        _.isEmpty(company.value.district?.id) ||
        _.isEmpty(company.value.street) ||
        _.isEmpty(company.value.accounts?.[0]?.bank?.id) ||
        (company.value.accounts?.[0]?.number?.length ?? 0) < 20 ||
        _.isEmpty(company.value.name) ||
        _.isEmpty(company.value.chiefName) ||
        _.isEmpty(company.value.account)
      : _.isEmpty(individual.value.id) ||
        _.isEmpty(individual.value.accounts?.[0]?.bank?.id) ||
        (individual.value.accounts?.[0]?.number?.length ?? 0) < 20)
);

const signed = computed(() => osgor.value.status === BaseContractStatus.SIGNED);

watch(
  () => osgor.value.contractStartDate,
  (value) => {
    if (value) {
      osgor.value.contractEndDate = dayjs(value)
        .add(1, "year")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
    }
  }
);

watch(
  () => company.value.oked,
  async (value) => {
    if (value) {
      const response = (await invokeQuery(
        "reference_OsgorActivityCoefficient",
        "activityCoefficient",
        {
          method: "POST",
          data: {
            oked: value.id,
          },
        }
      )) as { data?: ActivityCoefficient[] };

      if (!_.isEmpty(response.data)) {
        osgor.value.activityCoefficient = _.maxBy(
          response.data,
          "coefficient"
        )!;
      }
    }
  }
);

osgor.value.contractStartDate = dayjs().add(1, "day").format("YYYY-MM-DD");
company.value.nationalIdentifier = import.meta.env.VITE_COMPANY_INN;
individual.value.passportNumber = import.meta.env.VITE_PERSON_PASSPORT_NUMBER;
individual.value.passportSeries = import.meta.env.VITE_PERSON_PASSPORT_SERIES;
individual.value.birthDate = import.meta.env.VITE_PERSON_BIRTH_DATE;

function save() {
  const payload = {
    ...osgor.value,
    activityCoefficient: isLegal.value
      ? osgor.value.activityCoefficient
      : { id: 21 },
    party: isLegal.value ? company.value : individual.value,
  };

  // Remove all non-digits from phone number
  payload.party.phone = payload.party.phone?.replace(/[+()-]/g, "");

  if (osgor.value.id) {
    store.update({ osgor: payload });
  } else {
    store
      .create({
        user: user.value,
        osgor: payload,
      })
      .then((id) => {
        router.push({ name: "osgor-details", params: { id } });
      });
  }
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
    osgor.value = value!;

    if (isLegal.value) {
      company.value = value.party as Company;
    } else {
      individual.value = value.party as Individual;
    }

    // HACK: remove once BE starts to return accounts
    if (_.isEmpty(individual.value.accounts)) {
      individual.value.accounts = [new BankAccount()];
    }

    store.fetchFundData();
  }
});
</script>
