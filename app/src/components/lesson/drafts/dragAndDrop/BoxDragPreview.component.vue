<script setup lang="ts">
import Box from "@/components/lesson/drafts/dragAndDrop/Box.component.vue";

const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="box-drag-preview">
    <Box :title="title" :preview="true"/>
  </div>
</template>

<style scoped>

.box-drag-preview {
  display: inline-block;
  box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.2), 0 6px 20px 0 rgba(255, 255, 255, 0.19);
}
</style>