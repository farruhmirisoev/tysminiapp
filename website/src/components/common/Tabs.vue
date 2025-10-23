<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <select
        name="tabs"
        class="w-full input"
        :value="modelValue"
        @change="
          emits(
            'update:modelValue',
            parseInt(($event.target as HTMLInputElement).value, 10)
          )
        "
      >
        <option
          v-for="(option, index) in options"
          :selected="modelValue === index"
          :key="index"
          :value="index"
        >
          {{ option }}
        </option>
      </select>
    </div>

    <div class="hidden sm:block">
      <div class="border-b border-gray-300">
        <nav
          class="flex -mb-px space-x-4 overflow-x-auto scrollbar-hide"
          aria-label="Tabs"
        >
          <button
            v-for="(option, index) in options"
            :key="index"
            type="button"
            class="px-1 py-4 text-sm font-medium border-b-2 border-transparent whitespace-nowrap"
            :class="
              index === modelValue
                ? 'border-primary-light text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            "
            @click="emits('update:modelValue', index)"
          >
            {{ option }}
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  modelValue: number;
  options: string[];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();
</script>
