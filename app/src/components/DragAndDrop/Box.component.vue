<script lang="ts" setup>

const props = defineProps<{
  title: string
  preview?: boolean
}>();


</script>

<template>
  <div
      class="box"
      :role="preview ? 'BoxPreview' : 'Box'"
  >
    {{ title }}
  </div>
</template>

<style scoped>
.box {
  width: 150px;
  font-size: 0.875em;
  padding: 0.5rem 1rem;
  border: 1px solid lightgray;
  background-color: rgb(var(--v-theme-info));
  border-radius: 5px;
  cursor: move;
  user-select: none;
  text-align: center;
  height: auto;
}
</style>