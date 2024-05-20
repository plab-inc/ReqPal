<script lang="ts" setup>
import {useDrag, useDrop} from 'vue3-dnd'
import {computed, unref} from 'vue'
import {toRefs} from '@vueuse/core'
import {DragItemTypes} from "@/types/dragItem.types.ts";

const props = defineProps<{
  id: string
  text: string
  moveCard: (id: string, to: number) => void
  findCard: (id: string) => { index: number }
  allowDragAndDrop: boolean
}>()

interface Item {
  id: string
  originalIndex: number
}

const originalIndex = computed(() => props.findCard(props.id).index)
const [collect, drag] = useDrag(() => ({
  type: DragItemTypes.SORTABLE,
  item: () => ({id: props.id, originalIndex: originalIndex.value}),
  collect: monitor => ({
    isDragging: monitor.isDragging(),
  }),
  end: (item, monitor) => {
    const {id: droppedId, originalIndex} = item
    const didDrop = monitor.didDrop()
    if (!didDrop) {
      props.moveCard(droppedId, originalIndex)
    }
  },
}))

const [, drop] = useDrop(() => ({
  accept: DragItemTypes.SORTABLE,
  hover({id: draggedId}: Item) {
    if (draggedId !== props.id) {
      const {index: overIndex} = props.findCard(props.id)
      props.moveCard(draggedId, overIndex)
    }
  },
}))

const {isDragging} = toRefs(collect)
const opacity = computed(() => (unref(isDragging) ? 0 : 1))

let dragAndDropRef = null

const setDragAndDropRef = (node: any) => {
  dragAndDropRef = node
  if (dragAndDropRef) {
    drag(drop(dragAndDropRef))
  }
}

</script>

<template>
  <div v-if="allowDragAndDrop" :ref="setDragAndDropRef" class="card w-75" :style="{opacity: isDragging ? 0 : 1}">
    {{ text }}
  </div>
  <div v-else class="card w-75">
    {{ text }}
  </div>
</template>

<style scoped>
.card {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  text-align: center;
  border: 1px solid lightgray;
  border-radius: 5px;
  background-color: rgb(var(--v-theme-info));
  cursor: move;
}
</style>