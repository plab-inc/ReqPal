<script lang="ts" setup>
import { useDrop, XYCoord } from 'vue3-dnd';
import { ItemTypes } from '@/types/dragAndDrop.types';
import Box from './Box.component.vue';
import type { DragItem } from '@/interfaces/DragAndDrop.interfaces';

const props = defineProps({
  boxTitles: Array as () => string[],
});

const boxes = reactive<{
  [key: string]: {
    top: number;
    left: number;
    title: string;
  };
}>({});

props.boxTitles?.forEach((title, index) => {
  const boxKey = `box_${index}`;
  boxes[boxKey] = { top: 50 + index * 100, left: 80, title };
});

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
        :id="key"
        :key="key"
        :left="value.left"
        :top="value.top"
    >
      {{ value.title }}
    </Box>
  </div>
</template>