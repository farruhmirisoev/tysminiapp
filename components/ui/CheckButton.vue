<template>
  <button
    type="button"
    class="check-button"
    :class="{
      'active': active,
      'disabled': disabled,
    }"
    :disabled="disabled"
    @click="handleClick"
  >
    <!-- Icon (optional) -->
    <div v-if="icon" class="check-icon">
      {{ icon }}
    </div>

    <!-- Content -->
    <div class="check-content">
      <!-- Title -->
      <div class="check-title">
        <slot>{{ title }}</slot>
      </div>

      <!-- Description (optional) -->
      <div v-if="description || $slots.description" class="check-description">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>

    <!-- Check indicator -->
    <div class="check-indicator">
      <div class="check-circle">
        <div v-if="active" class="check-dot"></div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  icon?: string
  active?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  icon: '',
  active: false,
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
.check-button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  outline: none;
  position: relative;
  overflow: hidden;
}

.check-button:hover:not(.disabled) {
  border-color: #2481CC;
  background: rgba(36, 129, 204, 0.02);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.check-button:active:not(.disabled) {
  transform: translateY(0);
}

.check-button.active {
  border-color: #2481CC;
  background: rgba(36, 129, 204, 0.08);
  box-shadow: 0 0 0 1px rgba(36, 129, 204, 0.1);
}

.check-button.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #2481CC, #3A91DC);
  border-radius: 12px 0 0 12px;
}

.check-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #F9FAFB;
}

/* Icon */
.check-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: rgba(36, 129, 204, 0.1);
  border-radius: 8px;
}

.check-button.active .check-icon {
  background: rgba(36, 129, 204, 0.2);
}

/* Content */
.check-content {
  flex: 1;
  min-width: 0;
}

.check-title {
  font-size: 15px;
  font-weight: 500;
  color: #1F2937;
  line-height: 1.4;
  word-break: break-word;
}

.check-button.active .check-title {
  font-weight: 600;
  color: #2481CC;
}

.check-description {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.4;
  margin-top: 4px;
}

/* Check Indicator */
.check-indicator {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #D1D5DB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: white;
}

.check-button.active .check-circle {
  border-color: #2481CC;
  background: #2481CC;
}

.check-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: checkDotAppear 0.2s ease;
}

@keyframes checkDotAppear {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Touch feedback for mobile */
@media (hover: none) {
  .check-button:active:not(.disabled) {
    background: rgba(36, 129, 204, 0.05);
  }
}

/* Compact mode for smaller screens */
@media (max-width: 640px) {
  .check-button {
    padding: 12px 14px;
    gap: 10px;
  }

  .check-icon {
    width: 28px;
    height: 28px;
    font-size: 18px;
  }

  .check-title {
    font-size: 14px;
  }

  .check-description {
    font-size: 12px;
  }

  .check-circle {
    width: 18px;
    height: 18px;
  }

  .check-dot {
    width: 7px;
    height: 7px;
  }
}
</style>
