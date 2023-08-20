<script lang="ts" setup>
import { useDrop, XYCoord } from 'vue3-dnd'
import { ItemTypes } from '@/types/DragAndDrop.types'
import Box from './Box.component.vue'
import type { DragItem } from '@/interfaces/DragAndDrop.interfaces'
import { reactive, ref } from 'vue'

const boxes = reactive<{
  [key: string]: {
    top: number
    left: number
    title: string
  }
}>({
  a: { top: 100, left: 100, title: 'Drag me around' },
  b: { top: 150, left: 300, title: 'Drag me too' },
})

const moveBox = (id: string, left: number, top: number) => {
  Object.assign(boxes[id], { left, top })
}

const [, drop] = useDrop(() => ({
  accept: ItemTypes.BOX,
  drop(item: DragItem, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
    const left = Math.round(item.left + delta.x)
    const top = Math.round(item.top + delta.y)
    moveBox(item.id, left, top)
    return undefined
  },
}))
</script>

<template>
  <div :ref="drop" class="container">
    <Box
        v-for="(value, key) in boxes"
        hide-source-on-drag
        :id="key"
        :key="key"
        :left="value.left"
        :top="value.top"
    >
      {{ value.title }}
    </Box>
  </div>
</template>