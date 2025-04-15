<script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <a-layout-content class="p-6 overflow-x-hidden w-full">
    <div class="container mx-auto">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <a-card class="mb-6">
            <a-typography-title :level="2">Welcome to SLM Admin</a-typography-title>
            <a-typography-paragraph>
              This is the admin dashboard for SLM Solar. You can manage products, contracts, and other content here.
            </a-typography-paragraph>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <TheWelcome />
        </a-col>
      </a-row>
    </div>
  </a-layout-content>
</template>

<style>
/* Remove all custom CSS as we're using Tailwind now */
</style>
