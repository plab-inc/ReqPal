<script lang="ts" setup>
import { useDrop, XYCoord } from 'vue3-dnd';
import { ItemTypes } from '@/types/dragAndDrop.types';
import Box from './Box.component.vue';
import type { DragItem } from '@/interfaces/DragAndDrop.interfaces';
import { useBoxStore } from '@/stores/dndBoxStore.store';

const props = defineProps({
  boxTitles: Array as () => string[],
  containerId: {
    type: String,
    required: true
  },
});

const boxStore = useBoxStore();

props.boxTitles?.forEach((title, index) => {
  const boxKey = `box_${index}`;
  boxStore.addBox(boxKey, { top: 50 + index * 100, left: 80, title, containerId: props.containerId });
});


const [, drop] = useDrop(() => ({
  accept: ItemTypes.BOX,
  drop(item: DragItem, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
    const left = Math.round(item.left + delta.x)
    const top = Math.round(item.top + delta.y)
    boxStore.moveBox(item.id, left, top, props.containerId);
    return undefined
  },
}));

</script>

<template>
  <div :ref="drop" class="container">
    <Box
        v-for="(value, key) in boxStore.boxes"
        :id="key"
        :key="key"
        :left="value.left"
        :top="value.top"
    >
      {{ value.title }}
    </Box>
  </div>
</template>