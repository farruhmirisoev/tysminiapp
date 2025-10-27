<template>
  <div class="input-field" :class="{ 'has-error': error }">
    <!-- Label -->
    <label v-if="label" class="input-label" :for="inputId">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="input-wrapper">
      <!-- Icon (left) -->
      <div v-if="icon" class="input-icon input-icon-left">
        <i :class="icon"></i>
      </div>

      <!-- Input element -->
      <input
        :id="inputId"
        ref="inputRef"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :autocomplete="autocomplete"
        :inputmode="inputMode"
        class="input"
        :class="{
          'input-with-icon-left': icon,
          'input-with-icon-right': clearable || loading,
          'input-error': error,
        }"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keypress="handleKeyPress"
        @keydown.enter="handleEnter"
      />

      <!-- Clear button -->
      <button
        v-if="clearable && inputValue && !disabled && !readonly"
        type="button"
        class="input-icon input-icon-right input-clear"
        @click="handleClear"
      >
        <i class="bx bx-x"></i>
      </button>

      <!-- Loading spinner -->
      <div v-if="loading" class="input-icon input-icon-right">
        <div class="spinner-small"></div>
      </div>
    </div>

    <!-- Helper text or error message -->
    <div v-if="helperText || error" class="input-message">
      <span v-if="error" class="error-message">{{ error }}</span>
      <span v-else-if="helperText" class="helper-text">{{ helperText }}</span>
    </div>

    <!-- Character count -->
    <div v-if="showCount && maxLength" class="input-count">
      {{ inputValue.length }} / {{ maxLength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: 'text' | 'tel' | 'email' | 'number' | 'date' | 'password'
  icon?: string
  error?: string
  helperText?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  loading?: boolean
  maxLength?: number
  showCount?: boolean
  autocomplete?: string
  inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'decimal' | 'search' | 'url'
  mask?: string
  autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  type: 'text',
  icon: '',
  error: '',
  helperText: '',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  loading: false,
  maxLength: undefined,
  showCount: false,
  autocomplete: 'off',
  inputMode: 'text',
  mask: '',
  autofocus: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: []
  focus: []
  enter: []
  input: [value: string | number]
}>()

// Refs
const inputRef = ref<HTMLInputElement | null>(null)
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

// Internal value
const inputValue = computed({
  get: () => String(props.modelValue || ''),
  set: (value: string) => {
    emit('update:modelValue', value)
  },
})

// Handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value

  // Apply mask if provided
  if (props.mask) {
    value = applyMask(value)
  }

  emit('update:modelValue', value)
  emit('input', value)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}

const handleKeyPress = (event: KeyboardEvent) => {
  // Custom key press validation can be added here
}

const handleEnter = () => {
  emit('enter')
}

const handleClear = () => {
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

// Apply input mask
const applyMask = (value: string): string => {
  if (!props.mask) return value

  // Simple mask implementation
  // Format: # for digit, A for letter, * for any character
  let maskedValue = ''
  let valueIndex = 0
  const cleanValue = value.replace(/\D/g, '') // Remove non-digits for phone/number masks

  for (let i = 0; i < props.mask.length && valueIndex < cleanValue.length; i++) {
    const maskChar = props.mask[i]
    if (maskChar === '#') {
      maskedValue += cleanValue[valueIndex]
      valueIndex++
    } else {
      maskedValue += maskChar
    }
  }

  return maskedValue
}

// Focus input programmatically
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Auto-focus on mount
onMounted(() => {
  if (props.autofocus) {
    focus()
  }
})

// Expose methods
defineExpose({
  focus,
  blur,
})
</script>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

/* Label */
.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 2px;
}

/* Input wrapper */
.input-wrapper {
  position: relative;
  width: 100%;
}

/* Input */
.input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  color: #1F2937;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  outline: none;
  transition: all 0.2s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.input::placeholder {
  color: #9CA3AF;
}

.input:hover:not(:disabled):not(:readonly) {
  border-color: #D1D5DB;
}

.input:focus {
  border-color: #2481CC;
  box-shadow: 0 0 0 3px rgba(36, 129, 204, 0.1);
}

.input:disabled {
  background: #F9FAFB;
  color: #9CA3AF;
  cursor: not-allowed;
}

.input:readonly {
  background: #F9FAFB;
  cursor: default;
}

/* Input with icons */
.input-with-icon-left {
  padding-left: 44px;
}

.input-with-icon-right {
  padding-right: 44px;
}

/* Icons */
.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #6B7280;
  font-size: 18px;
  pointer-events: none;
}

.input-icon-left {
  left: 2px;
}

.input-icon-right {
  right: 2px;
}

.input-clear {
  pointer-events: all;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  color: #9CA3AF;
  transition: color 0.2s ease;
}

.input-clear:hover {
  color: #6B7280;
}

.input-clear:active {
  color: #4B5563;
}

/* Error state */
.input-error {
  border-color: #EF4444;
}

.input-error:focus {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.has-error .input-label {
  color: #EF4444;
}

/* Messages */
.input-message {
  min-height: 20px;
  font-size: 13px;
  line-height: 1.4;
}

.error-message {
  color: #EF4444;
  font-weight: 500;
}

.helper-text {
  color: #6B7280;
}

/* Character count */
.input-count {
  font-size: 12px;
  color: #9CA3AF;
  text-align: right;
  margin-top: -4px;
}

/* Loading spinner */
.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #E5E7EB;
  border-top-color: #2481CC;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .input {
    padding: 11px 14px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .input-with-icon-left {
    padding-left: 42px;
  }

  .input-with-icon-right {
    padding-right: 42px;
  }

  .input-label {
    font-size: 13px;
  }

  .input-message {
    font-size: 12px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .input {
    background: #1F2937;
    border-color: #374151;
    color: #F9FAFB;
  }

  .input::placeholder {
    color: #6B7280;
  }

  .input:hover:not(:disabled):not(:readonly) {
    border-color: #4B5563;
  }

  .input:focus {
    border-color: #3A91DC;
  }

  .input:disabled,
  .input:readonly {
    background: #111827;
    color: #6B7280;
  }

  .input-label {
    color: #F9FAFB;
  }

  .input-icon {
    color: #9CA3AF;
  }

  .helper-text {
    color: #9CA3AF;
  }
}
</style>
