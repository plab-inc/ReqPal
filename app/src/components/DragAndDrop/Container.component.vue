<script lang="ts" setup>
import { useDrop, XYCoord } from 'vue3-dnd';
import { ItemTypes } from '@/types/DragAndDrop.types';
import Box from './Box.component.vue';
import type { DragItem } from '@/interfaces/DragAndDrop.interfaces';
import { useBoxStore } from '@/stores/dndBoxStore.store';

const props = defineProps<{ containerId: string, answers?: string[] }>();
const boxStore = useBoxStore();
const boxes = computed(() => boxStore.boxes);

props.answers?.forEach((answer, index) => {
  boxStore.addBox(String(index), answer, 100 + (100 * index),100);
});

const [, drop] = useDrop(() => ({
  accept: ItemTypes.BOX,
  drop(item: DragItem, monitor) {

    const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);

    boxStore.moveBox(item.id, left, top);
  },
}));

</script>

<template>
  <div :ref="drop" :data-id="containerId" class="container">
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