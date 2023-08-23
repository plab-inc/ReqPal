<script lang="ts" setup>
import { useDrag } from 'vue3-dnd'
import { ItemTypes } from '@/types/dragAndDrop.types'
import { toRefs } from '@vueuse/core'

const props = defineProps<{
  id: string;
  left: number;
  top: number;
  containerId: string;
}>();

const [collect, drag] = useDrag(() => ({
  type: ItemTypes.BOX,
  item: { id: props.id, left: props.left, top: props.top, containerId: props.containerId },
  collect: monitor => ({
    isDragging: monitor.isDragging(),
  }),
}))

const { isDragging } = toRefs(collect)
</script>

<template>
  <div v-if="isDragging" :ref="drag"/>
  <div v-else
       :ref="drag"
       class="box"
       :style="{
        left: `${props.left}px`,
        top: `${props.top}px`,
      }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.box {
  position: absolute;
  padding: 0.5rem 1rem;
  border: 1px dashed gray;
  border-radius: 5px;
  cursor: move;
  user-select: none;
}
</style>