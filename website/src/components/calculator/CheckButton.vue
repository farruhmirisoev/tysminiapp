<template>
  <button
    type="button"
    class="flex items-center justify-between h-16 gap-4 px-4 text-xs rounded-lg md:text-sm"
    :class="active ? 'border-2 border-primary' : 'border border-gray-300'"
  >
    <div class="text-left line-clamp-2">
      <slot></slot>
    </div>
    <div class="flex-none text-xl">
      <i
        class="bx"
        :class="
          active
            ? 'bxs-checkbox-checked text-primary'
            : 'bx-checkbox text-gray-600'
        "
      ></i>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean;
}>();
</script>
