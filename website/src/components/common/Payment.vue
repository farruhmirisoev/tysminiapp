<template>
  <div>
    <div class="text-lg font-bold">{{ $t('payment.chooseMethod') }}</div>
    <div class="grid grid-cols-2 gap-4 mt-4">
      <div>
        <button
          type="button"
          class="w-full p-4 border-gray-300 btn hover:bg-gray-100"
          :title="$t('payment.payWithPayme')"
          @click="redirectToPayme"
        >
          <img src="/payme.svg" alt="payme" class="h-8" />
        </button>
        <a
          href="#"
          class="text-xs text-primary"
          @click.prevent="() => sendLink('sendSmsPayme')"
        >
          {{ $t('payment.sendSmsPayme') }}
          <i v-if="sendingLink" class="bx bx-loader-alt bx-spin"></i>
        </a>
      </div>

      <div>
        <button
          type="button"
          class="w-full p-4 border-gray-300 btn hover:bg-gray-100"
          :title="$t('payment.payWithClick')"
          @click="redirectToClick"
        >
          <img src="/click.png" alt="click" class="h-8" />
        </button>
        <a
          href="#"
          class="text-xs text-primary"
          @click.prevent="() => sendLink('sendSmsClick')"
        >
          {{ $t('payment.sendSmsClick') }}
          <i v-if="sendingLink" class="bx bx-loader-alt bx-spin"></i>
        </a>
      </div>

      <button
        type="button"
        class="w-full p-4 border-gray-300 btn hover:bg-gray-100"
        :title="$t('payment.payWithUzum')"
        @click="redirectToUzum"
      >
        <img src="/uzum.svg" alt="uzum" class="h-8" />
      </button>
    </div>

    <transition name="fade">
      <div v-if="sendLinkError" class="mt-4 text-sm text-red-600">
        {{ sendLinkError }}
      </div>
    </transition>

    <button
      type="button"
      class="w-full mt-4 text-sm btn btn-primary-outlined"
      :disabled="!!seconds || fetching"
      @click="checkStatus"
    >
      {{ $t('payment.checkStatus') }}
      <span v-if="seconds" class="ml-1">({{ seconds }})</span>
    </button>

    <transition name="fade">
      <div v-if="fetchError" class="mt-4 text-sm text-red-600">
        {{ fetchError }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { onBeforeUnmount, ref } from "vue";

import rest, { AjaxError } from "@/misc/rest";

const props = defineProps<{
  id: string;
  phone: string;
  amount: number;
  refresh: Function;
}>();

const seconds = ref(0);
const fetching = ref(false);
const fetchError = ref<AjaxError | null>(null);
const sendingLink = ref(false);
const sendLinkError = ref<AjaxError | null>(null);

let interval: number;
async function checkStatus() {
  fetching.value = true;
  await props.refresh().catch((e: AjaxError) => {
    fetchError.value = e;
  });
  fetching.value = false;

  seconds.value = 15;
  interval = window.setInterval(() => {
    if (seconds.value) {
      seconds.value--;
    } else {
      window.clearInterval(interval);
    }
  }, 1000);
}

onBeforeUnmount(() => {
  window.clearInterval(interval);
});

function redirectToPayme() {
  const url = import.meta.env.VITE_PAYME_CHECKOUT;
  const merchant = import.meta.env.VITE_PAYME_MERCHANT;

  const param = btoa(
    `m=${merchant};ac.contract_id=${props.id};a=${props.amount * 100};c=${
      window.location.href
    }`
  );

  window.location.href = `${url}${param}`;
}

function redirectToClick() {
  window.location.href = `${import.meta.env.VITE_CLICK_CHECKOUT}?service_id=${
    import.meta.env.VITE_CLICK_SERVICE
  }&merchant_id=${import.meta.env.VITE_CLICK_MERCHANT}&transaction_param=${
    props.id
  }&amount=${props.amount}`;
}

function redirectToUzum() {
  window.location.href = `${import.meta.env.VITE_UZUM_CHECKOUT}?serviceId=${
    import.meta.env.VITE_UZUM_SERVICE_ID
  }&userId=${props.id}&amount=${props.amount * 100}`;
}

async function sendLink(method: string) {
  sendingLink.value = true;
  sendLinkError.value = null;

  try {
    const response = (await rest.invokeService("BillingService", method, {
      method: "POST",
      data: {
        object: {
          phone: props.phone.replace(/[+()-]/g, ""),
          contractId: props.id,
          amount: props.amount,
        },
      },
    })) as { data: { error: any } };

    if (response.data.error) {
      rest.handleError({ response });
    }
  } catch (err) {
    sendLinkError.value = err as AjaxError;
    throw err;
  } finally {
    sendingLink.value = false;
  }
}
</script>
