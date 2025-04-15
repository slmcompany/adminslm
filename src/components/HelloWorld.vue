<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <a-card class="greetings">
    <a-typography-title :level="1" class="green">{{ msg }}</a-typography-title>
    <a-typography-paragraph>
      You've successfully created a project with
      <a-typography-link href="https://vite.dev/" target="_blank">Vite</a-typography-link> +
      <a-typography-link href="https://vuejs.org/" target="_blank">Vue 3</a-typography-link>.
    </a-typography-paragraph>
  </a-card>
</template>

<style scoped>
.greetings {
  text-align: center;
}

.green {
  color: #42b983;
}

@media (min-width: 1024px) {
  .greetings {
    text-align: left;
  }
}
</style>
