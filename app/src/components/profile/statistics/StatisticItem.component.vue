<template>
  <div class="pa-4 ma-3 item bg-primary d-flex align-center justify-center">
    <h1 class="text-center">{{ text }}</h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: String,
}

const props = defineProps<Props>();

</script>
<style scoped>

.item {
  border: 2px solid white;
  border-radius: 40px;
  height: 100%;
}

</style>
