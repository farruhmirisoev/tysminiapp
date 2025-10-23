<template>
  <div v-for="(field, index) in fields" :key="index" class="mb-4 text-sm">
    <div class="font-bold">
      {{ field.label }}
    </div>
    <div class="mt-1">
      {{ field.value }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { mask, tokens } from "maska";
import { useI18n } from "vue-i18n";

import { Company } from "@/models/entities/base/base$Company";
import { formatPirce } from "@/misc/filters";
import { Individual } from "@/models/entities/base/base$Individual";
import { Osgor } from "@/models/entities/osgor_Osgor";

const { t } = useI18n();

const props = defineProps<{
  osgor: Osgor;
  company?: Company | null;
  individual?: Individual | null;
}>();

const fields = computed(() => {
  const entries = [];

  if (props.company) {
    entries.push(
      {
        label: t('osgor.details.companyName'),
        value: props.company.name,
      },
      {
        label: t('osgor.details.phone'),
        value: mask(props.company.phone || "", "+998(##)###-##-##", tokens),
      },
      {
        label: t('osgor.details.region'),
        value: props.company.region?.langValue1,
      },
      {
        label: t('osgor.details.address'),
        value: props.company.street,
      },
      {
        label: t('osgor.details.oked'),
        value: `(${props.company.oked?.code}) ${props.company.oked?.langValue1}`,
      }
    );
  }
  if (props.individual) {
    entries.push(
      {
        label: t('osgor.details.fullName'),
        value: `${props.individual.lastName} ${props.individual.firstName} ${props.individual.middleName}`,
      },
      {
        label: t('osgor.details.phone'),
        value: mask(props.individual.phone || "", "+998(##)###-##-##", tokens),
      },
      {
        label: t('osgor.details.region'),
        value: props.individual.region?.langValue1,
      },
      {
        label: t('osgor.details.address'),
        value: props.individual.street,
      }
    );
  }

  return [
    ...entries,
    {
      label: t('osgor.details.annualSalary'),
      value: `${formatPirce(props.osgor.limitOfLiability ?? 0)} ${t('common.currency')}`,
    },
    {
      label: t('osgor.details.insurancePremium'),
      value: `${formatPirce(props.osgor.premium ?? 0)} ${t('common.currency')}`,
    },
  ];
});
</script>
