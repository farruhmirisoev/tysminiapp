<template>
  <div class="auth-container">
    <div class="auth-content">
      <div class="auth-header">
        <img src="/assets/img/tyslogo.png" alt="TYS" class="auth-logo" />
        <h2 class="auth-title">{{ title }}</h2>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-content {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo {
  height: 48px;
  margin-bottom: 16px;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}
</style>

