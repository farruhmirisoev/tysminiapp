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
import { Osgop } from "@/models/entities/osgop_Osgop";

const { t } = useI18n();

const props = defineProps<{
  osgop: Osgop;
  company?: Company | null;
  individual?: Individual | null;
}>();

const fields = computed(() => {
  const entries = [];

  if (props.company) {
    entries.push(
      {
        label: t('osgop.details.name'),
        value: props.company.name,
      },
      {
        label: t('osgop.details.phone'),
        value: mask(props.company.phone || "", "+998(##)###-##-##", tokens),
      },
      {
        label: t('osgop.details.region'),
        value: props.company.region?.langValue1,
      },
      {
        label: t('osgop.details.address'),
        value: props.company.street,
      }
    );
  }
  if (props.individual) {
    entries.push(
      {
        label: t('osgop.details.fullName'),
        value: `${props.individual.lastName} ${props.individual.firstName} ${props.individual.middleName}`,
      },
      {
        label: t('osgop.details.phone'),
        value: mask(props.individual.phone || "", "+998(##)###-##-##", tokens),
      },
      {
        label: t('osgop.details.region'),
        value: props.individual.region?.langValue1,
      },
      {
        label: t('osgop.details.address'),
        value: props.individual.street,
      }
    );
  }

  return [
    ...entries,
    {
      label: t('osgop.details.vehicle'),
      value: `${props.osgop.vehicle?.modelName} (${props.osgop.vehicle?.govNumber})`,
    },
    {
      label: t('osgop.details.insurancePremium'),
      value: `${formatPirce(props.osgop.premium ?? 0)} ${t('common.currency')}`,
    },
  ];
});
</script>
