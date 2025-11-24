<template>
  <div class="app">
    <h1>Pay2Nature Widget - Vue.js Example</h1>
    
    <div v-if="contributionData" class="success-message">
      <h3>Thank you for your contribution!</h3>
      <p>Amount: {{ contributionData.currency }}{{ contributionData.amount }}</p>
      <p v-if="contributionData.paymentUrl">
        <a :href="contributionData.paymentUrl" target="_blank" rel="noopener noreferrer">
          Open Payment
        </a>
      </p>
    </div>

    <Pay2NatureWidget
      :widget-token="widgetToken"
      :base-url="baseUrl"
      @contribution="handleContribution"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Pay2NatureWidget from '@pay2nature/widget-sdk/vue/Pay2NatureWidget.vue';
import type { ContributionData } from '@pay2nature/widget-sdk';

const widgetToken = ref(import.meta.env.VITE_WIDGET_TOKEN || 'your-widget-token');
const baseUrl = ref(import.meta.env.VITE_API_URL || 'https://api.pay2nature.com');
const contributionData = ref<ContributionData | null>(null);

const handleContribution = (data: ContributionData) => {
  console.log('Contribution made:', data);
  contributionData.value = data;
};

const handleError = (error: Error) => {
  console.error('Widget error:', error);
  alert('An error occurred: ' + error.message);
};
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
}

.success-message {
  padding: 15px;
  background-color: #d1fae5;
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>

