<template>
  <div :class="'bg-'+color" class="rounded-pill pa-3 ma-3 item">
    <h1>{{ text }}</h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: String,
  highlight: boolean
}

const props = defineProps<Props>();
let color: String = 'info';
if (props.highlight) {
  color = 'primary';
}

</script>
<style scoped>

.item {
  border: 2px solid white;
}

</style>
