<script lang="ts" setup>

import { useDrag } from 'vue3-dnd'
import { DragItemTypes } from '@/types/dragItem.types.ts'
import { toRefs } from '@vueuse/core'

const props = defineProps<{
  title: string
}>();

const [collect, drag] = useDrag(() => ({
  type: DragItemTypes.COMPONENT,
  item: () => ({
    name: props.title,
  }),
  collect: monitor => ({
    isDragging: monitor.isDragging(),
    handlerId: monitor.getHandlerId(),
  }),
}))

const { isDragging } = toRefs(collect);

</script>

<template>
  <div
      class="box"
      :ref="drag"
      :style="{ opacity: isDragging ? 0.3 : 1 }"
  >
    {{ title }}
  </div>
</template>

<style scoped>
.box {
  font-size: 0.875em;
  padding: 0.5rem 1rem;
  border: 1px solid lightgray;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 5px;
  cursor: move;
  user-select: none;
  text-align: center;
  height: auto;
}
</style>